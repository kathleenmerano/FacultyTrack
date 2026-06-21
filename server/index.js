import "dotenv/config";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { readFileSync, existsSync } from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("✅ Loading Firebase credentials from environment variable.");
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n').trim();
    }
  } catch (err) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT Parse Error:", err.message);
  }
}

if (!serviceAccount) {
  const jsonPath = new URL("./serviceAccountKey.json", import.meta.url);
  if (existsSync(jsonPath)) {
    try {
      serviceAccount = JSON.parse(readFileSync(jsonPath));
      console.log("📂 Loading Firebase credentials from local serviceAccountKey.json.");
    } catch (err) {
      console.error("❌ Local ServiceAccount File Error:", err.message);
    }
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("🔥 Firebase Admin initialized successfully.");
  } catch (err) {
    console.error("🔥 Firebase Initialization Error:", err.message);
    process.exit(1);
  }
} else {
  console.error("🚨 CRITICAL: No Firebase credentials found!");
  process.exit(1);
}
const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTE 1: CREATE USER ---
app.post("/create-user", async (req, res) => {
  const { email, password, fullName, role, ...extraData } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      fullName,
      role,
      status: "active",
      ...extraData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ADD THIS: General route to get ALL users for dropdowns
app.get("/get-users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 2: GET USERS (Moved outside of POST) ---
app.get("/get-users/:role", async (req, res) => {
  try {
    const role = req.params.role;
    const snapshot = await db.collection("users").where("role", "==", role).get();

    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 3: DELETE USER ---
app.delete("/delete-user/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    // 1. Delete from Auth
    await admin.auth().deleteUser(uid);
    // 2. Delete from Firestore
    await db.collection("users").doc(uid).delete();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 4: UPDATE USER ---
app.patch("/update-user/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const { fullName, email, ...otherData } = req.body;

    // 1. Update Firestore details
    await db.collection("users").doc(uid).update({
      fullName,
      email,
      ...otherData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Update Email in Firebase Auth if it changed
    await admin.auth().updateUser(uid, {
      email: email,
      displayName: fullName
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- DEPARTMENT CRUD ---
app.post("/create-department", async (req, res) => {
  try {
    const { name, description } = req.body;
    // This creates the 'departments' collection in Firestore automatically
    await db.collection("departments").add({
      name,
      description,
      createdAt: new Date()
    });
    res.status(200).send({ message: "Department Added" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/get-departments", async (req, res) => {
  try {
    const snapshot = await db.collection("departments").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

// --- SUBJECT CRUD ---
app.post("/create-subject", async (req, res) => {
  try {
    const { code, description } = req.body;
    await db.collection("subjects").add({
      code,
      description,
      createdAt: new Date()
    });
    res.status(200).send({ message: "Subject Added" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/get-subjects", async (req, res) => {
  try {
    const snapshot = await db.collection("subjects").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) {
    res.status(500).send(error);
  }
});

// --- SUBJECT UPDATE/DELETE ---
app.patch("/update-subject/:id", async (req, res) => {
  try {
    await db.collection("subjects").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/delete-subject/:id", async (req, res) => {
  try {
    await db.collection("subjects").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- DEPARTMENT UPDATE/DELETE ---
app.patch("/update-department/:id", async (req, res) => {
  try {
    await db.collection("departments").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/delete-department/:id", async (req, res) => {
  try {
    await db.collection("departments").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});


// --- CLASS ASSIGNMENT ROUTES ---

// GET all assignments
app.get("/get-assignments", async (req, res) => {
  try {
    const snapshot = await db.collection("classAssignments").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CREATE assignment
app.post("/create-assignment", async (req, res) => {
  try {
    const docRef = await db.collection("classAssignments").add(req.body);
    res.status(200).json({ id: docRef.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE assignment
app.patch("/update-assignment/:id", async (req, res) => {
  try {
    await db.collection("classAssignments").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE assignment
app.delete("/delete-assignment/:id", async (req, res) => {
  try {
    await db.collection("classAssignments").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ACADEMIC YEAR CRUD ---

app.get("/get-academic-years", async (req, res) => {
  try {
    const snapshot = await db.collection("academicYears").orderBy("createdAt", "desc").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).send(error); }
});

app.post("/create-academic-year", async (req, res) => {
  try {
    await db.collection("academicYears").add({
      ...req.body,
      createdAt: new Date()
    });
    res.status(200).send({ message: "Academic Year Added" });
  } catch (error) { res.status(500).send(error); }
});

app.patch("/update-academic-year/:id", async (req, res) => {
  try {
    await db.collection("academicYears").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/delete-academic-year/:id", async (req, res) => {
  try {
    await db.collection("academicYears").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});


// â”€â”€â”€ CRITERIA CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

app.post("/create-criteria", async (req, res) => {
  try {
    const { name } = req.body;
    const docRef = await db.collection("criteria").add({
      name,
      enabled: false,
      createdAt: new Date(),
    });
    res.status(200).json({ id: docRef.id, message: "Criteria added" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get("/get-criteria", async (req, res) => {
  try {
    const snapshot = await db.collection("criteria").orderBy("createdAt", "asc").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.patch("/update-criteria/:id", async (req, res) => {
  try {
    await db.collection("criteria").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/delete-criteria/:id", async (req, res) => {
  try {
    await db.collection("criteria").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// â”€â”€â”€ QUESTIONS CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

app.post("/create-question", async (req, res) => {
  try {
    const { criteriaId, text, order } = req.body;
    const docRef = await db.collection("questions").add({
      criteriaId,
      text,
      order: order || 0,
      createdAt: new Date(),
    });
    res.status(200).json({ id: docRef.id, message: "Question added" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get("/get-questions", async (req, res) => {
  try {
    const snapshot = await db.collection("questions").orderBy("order", "asc").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.patch("/update-question/:id", async (req, res) => {
  try {
    await db.collection("questions").doc(req.params.id).update(req.body);
    res.status(200).json({ message: "Updated" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/delete-question/:id", async (req, res) => {
  try {
    await db.collection("questions").doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// â”€â”€â”€ EVALUATION ROUTES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Submit evaluation â€” uses deterministic doc ID to prevent duplicates
app.post("/submit-evaluation", async (req, res) => {
  try {
    const { studentId, assignmentId, facultyId, academicYear, semester, ratings, comment } = req.body;
    if (!studentId || !assignmentId || !facultyId || !academicYear || !semester) {
      return res.status(400).json({ error: "Missing required evaluation fields." });
    }
    if (!ratings || typeof ratings !== "object" || Array.isArray(ratings) || Object.keys(ratings).length === 0) {
      return res.status(400).json({ error: "Ratings are required." });
    }

    // Validate assignment relationship integrity
    const assignmentRef = db.collection("classAssignments").doc(assignmentId);
    const assignmentSnap = await assignmentRef.get();
    if (!assignmentSnap.exists) {
      return res.status(400).json({ error: "Assigned class record not found." });
    }
    const assignmentData = assignmentSnap.data();
    if ((assignmentData.facultyId || "") !== facultyId) {
      return res.status(400).json({ error: "Faculty does not match the assigned class." });
    }
    if (
      assignmentData.academicYear &&
      assignmentData.semester &&
      (assignmentData.academicYear !== academicYear || assignmentData.semester !== semester)
    ) {
      return res.status(400).json({ error: "Evaluation period does not match the assigned class." });
    }

    // Validate that student belongs to the assigned class section
    const studentSnap = await db.collection("users").doc(studentId).get();
    if (!studentSnap.exists) {
      return res.status(400).json({ error: "Student profile not found." });
    }
    const studentData = studentSnap.data();
    const studentDept = studentData.department || studentData.dept || "";
    const studentYear = studentData.yearLevel || studentData.year || "";
    const studentSection = studentData.section || "";
    if (
      studentData.role !== "student" ||
      (studentData.status || "").toLowerCase() !== "active" ||
      assignmentData.department !== studentDept ||
      assignmentData.yearLevel !== studentYear ||
      assignmentData.section !== studentSection
    ) {
      return res.status(403).json({ error: "Student is not assigned to this class." });
    }

    // â”€â”€ 1. Validate that the evaluation period is currently open â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const aySnapshot = await db.collection("academicYears")
      .where("year", "==", academicYear)
      .where("semester", "==", semester)
      .limit(1)
      .get();

    if (aySnapshot.empty) {
      return res.status(400).json({ error: "Invalid academic year or semester." });
    }

    const ayData = aySnapshot.docs[0].data();
    // Only "on-going" means the evaluation window is open; "closed" means not accepting submissions.
    const isOpen = (ayData.status || "").toLowerCase().trim() === "on-going";

    // Also enforce endDate if it is set.
    // endDate is stored as "YYYY-MM-DD". Append T23:59:59 so the full calendar
    // day is valid â€” avoids premature expiry due to UTC vs local timezone offset.
    const now = new Date();
    const endDate = ayData.endDate ? new Date(ayData.endDate + "T23:59:59") : null;
    const periodExpired = endDate && now > endDate;

    if (!isOpen || periodExpired) {
      return res.status(403).json({
        error: "The evaluation period is currently closed. Submissions are not accepted at this time."
      });
    }
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    // â”€â”€ 2. Prevent duplicate submissions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const docId = `${studentId}_${assignmentId}`;
    const docRef = db.collection("evaluations").doc(docId);
    const existing = await docRef.get();
    if (existing.exists) {
      return res.status(400).json({ error: "Evaluation already submitted for this faculty." });
    }
    await docRef.set({
      studentId,
      assignmentId,
      facultyId,
      academicYear,
      semester,
      ratings: ratings || {},
      comment: comment || "",
      submittedAt: new Date(),
    });
    res.status(200).json({ message: "Evaluation submitted successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get all evaluations (admin)
app.get("/get-evaluations", async (req, res) => {
  try {
    const snapshot = await db.collection("evaluations").get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get evaluations for a specific faculty
app.get("/get-evaluations/faculty/:facultyId", async (req, res) => {
  try {
    const snapshot = await db.collection("evaluations")
      .where("facultyId", "==", req.params.facultyId)
      .get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get evaluations submitted by a specific student (to know which are done)
app.get("/get-submissions/student/:studentId", async (req, res) => {
  try {
    const snapshot = await db.collection("evaluations")
      .where("studentId", "==", req.params.studentId)
      .get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(list);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));

