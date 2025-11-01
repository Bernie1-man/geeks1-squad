'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

type AuthCallback = (error?: FirebaseError) => void;

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth, cb?: AuthCallback): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch((error: FirebaseError) => {
    if (cb) cb(error)
  });
  if (cb) cb();
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, cb?: AuthCallback): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password).catch((error: FirebaseError) => {
     if (cb) cb(error)
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
   if (cb) cb();
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, cb?: AuthCallback): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .then(() => {
       if (cb) cb();
    })
    .catch((error: FirebaseError) => {
      if (cb) cb(error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
