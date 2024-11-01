const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Definir la función eliminarProyecto
exports.eliminarProyecto = functions.https.onCall(async (data, context) => {
    const projectId = data.id;
    try {
        await db.collection("proyectos").doc(projectId).delete();
        return { success: true };
    } catch (error) {
        throw new functions.https.HttpsError("internal", "Error al eliminar el proyecto");
    }
});
