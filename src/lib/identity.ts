export const LOCAL_UID = "local";

export type SessionUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export const localSessionUser: SessionUser = {
  uid: LOCAL_UID,
  displayName: "You",
  email: "",
  photoURL: "",
};

export function isLocalUid(uid: string | null | undefined): boolean {
  return uid === LOCAL_UID;
}

export function sessionFromFirebase(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): SessionUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}
