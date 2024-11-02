const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.deleteProyecto = functions.https.onCall(async (data, context) => {
    const projectId = data.id;
    try {
        await admin.firestore().collection("proyectos").doc(projectId).delete();
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        throw new functions.https.HttpsError('internal', 'Error al eliminar el proyecto');
    }
});
