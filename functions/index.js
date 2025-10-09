const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

// ... (otras funciones como setUserRole, verifyWalker, etc.)

/**
 * Asigna el rol de Super Administrador al primer usuario que se registre.
 * Se ejecuta automáticamente cuando se crea un nuevo usuario.
 */
exports.setInitialSuperAdmin = functions.auth.user().onCreate(async (user) => {
  const { uid } = user;

  try {
    // 1. Verificar si ya existe un Super Administrador.
    const usersCollection = admin.firestore().collection('users');
    const superAdminQuery = await usersCollection.where('role', '==', 'superadmin').get();

    // 2. Si no hay Super Administradores, asigna el rol al nuevo usuario.
    if (superAdminQuery.empty) {
      console.log(`No se encontraron Super Admins. Asignando rol a ${uid}`);
      
      // Asignar Custom Claim para el rol
      await admin.auth().setCustomUserClaims(uid, { role: 'superadmin' });

      // Actualizar el documento del usuario en Firestore
      await usersCollection.doc(uid).update({
        role: 'superadmin',
        status: 'activo'
      });

      console.log(`El usuario ${uid} ha sido configurado como Super Administrador.`);
      return { message: `El usuario ${uid} ahora es Super Administrador.` };
    }

    console.log("Ya existe un Super Administrador. No se requiere ninguna acción.");
    return null;

  } catch (error) {
    console.error("Error al configurar el Super Administrador inicial:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Ocurrió un error al procesar la creación del usuario.'
    );
  }
});

/**
 * Asigna un rol personalizado a un usuario.
 * Solo puede ser ejecutada por un Super Administrador.
 */
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // 1. Verificar que el que llama es un Super Administrador.
  if (context.auth.token.role !== 'superadmin') {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Solo un Super Administrador puede asignar roles.'
    );
  }

  const { uid, newRole } = data;

  // 2. Validar que el nuevo rol es uno de los permitidos.
  const allowedRoles = ['propietario', 'paseador', 'admin', 'superadmin'];
  if (!allowedRoles.includes(newRole)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'El rol especificado no es válido.'
    );
  }

  try {
    // 3. Asignar el Custom Claim (rol) al usuario.
    await admin.auth().setCustomUserClaims(uid, { role: newRole });

    // 4. Actualizar el rol en Firestore para consistencia.
    await admin.firestore().collection('users').doc(uid).update({ role: newRole });

    return { 
      status: 'success', 
      message: `El rol de ${uid} ha sido actualizado a ${newRole}.`
    };
  } catch (error) {
    console.error("Error al asignar rol:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Ocurrió un error al intentar asignar el rol.'
    );
  }
});

/**
 * Verifica a un paseador, cambiando su estado a 'verificado'.
 * Solo puede ser ejecutada por un Administrador o Super Administrador.
 */
exports.verifyWalker = functions.https.onCall(async (data, context) => {
  const authorizedRoles = ['admin', 'superadmin'];
  if (!authorizedRoles.includes(context.auth.token.role)) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Solo un Administrador puede verificar paseadores.'
    );
  }

  const { uid } = data;

  try {
    await admin.firestore().collection('users').doc(uid).update({ status: 'verificado' });
    return { 
      status: 'success', 
      message: `El paseador ${uid} ha sido verificado.`
    };
  } catch (error) {
    console.error("Error al verificar paseador:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Ocurrió un error al verificar al paseador.'
    );
  }
});

/**
 * Desactiva la cuenta de un usuario.
 * Solo puede ser ejecutada por un Administrador o Super Administrador.
 */
exports.deactivateUser = functions.https.onCall(async (data, context) => {
  const authorizedRoles = ['admin', 'superadmin'];
  if (!authorizedRoles.includes(context.auth.token.role)) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Solo un Administrador puede desactivar usuarios.'
    );
  }

  const { uid } = data;

  try {
    await admin.firestore().collection('users').doc(uid).update({ status: 'desactivado' });
    return { 
      status: 'success', 
      message: `El usuario ${uid} ha sido desactivado.`
    };
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Ocurrió un error al desactivar al usuario.'
    );
  }
});

/**
 * Crea una cuenta de administrador.
 * Solo puede ser ejecutada por un Super Administrador.
 */
exports.createAdmin = functions.https.onCall(async (data, context) => {
  if (context.auth.token.role !== 'superadmin') {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Solo un Super Administrador puede crear administradores.'
    );
  }

  const { email, password, name } = data;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
    });

    return { status: 'success', message: `Administrador ${name} creado con éxito.` };
  } catch (error) {
    console.error("Error al crear administrador:", error);
    throw new functions.https.HttpsError('internal', 'Error al crear administrador.');
  }
});
