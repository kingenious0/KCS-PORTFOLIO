import { db } from "./firebase";
import { collection, getDocs, addDoc, query, where, orderBy, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Beat, WebProject } from "@/types";

// --- BEATS SERVICE ---

const beatsCollection = collection(db, "beats");

export async function getBeats(): Promise<Beat[]> {
    const q = query(beatsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Beat));
}

export async function createBeat(beat: Omit<Beat, "id" | "createdAt">) {
    return await addDoc(beatsCollection, {
        ...beat,
        createdAt: Timestamp.now(),
    });
}

export async function updateBeat(id: string, updates: Partial<Beat>) {
    const docRef = doc(db, "beats", id);
    return await updateDoc(docRef, updates);
}

export async function deleteBeat(id: string) {
    const docRef = doc(db, "beats", id);
    return await deleteDoc(docRef);
}

// --- PROJECTS SERVICE ---

const projectsCollection = collection(db, "webProjects");

export async function getProjects(): Promise<WebProject[]> {
    const q = query(projectsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WebProject));
}

export async function createProject(project: Omit<WebProject, "id" | "createdAt">) {
    return await addDoc(projectsCollection, {
        ...project,
        createdAt: Timestamp.now(),
    });
}

export async function updateProject(id: string, updates: Partial<WebProject>) {
    const docRef = doc(db, "webProjects", id);
    return await updateDoc(docRef, updates);
}

export async function deleteProject(id: string) {
    const docRef = doc(db, "webProjects", id);
    return await deleteDoc(docRef);
}
