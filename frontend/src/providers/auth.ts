import {
	getAuth,
	getIdToken,
	signInWithPopup,
	signOut,
	GithubAuthProvider,
	onAuthStateChanged,
	type User,
	type Auth,
} from "firebase/auth";

import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

import firebaseApp from "./firebaseApp";

//#region Reactive hooks and Zustand store for auth state consumption in React Tree as well as provider

type UserInState = {
	uid: string;
	displayName: string | null;
	email: string | null;
	emailVerified: boolean;
	phoneNumber: string | null;
	photoURL: string | null;
};

interface AuthStoreState {
	user: Record<string, UserInState[keyof UserInState]> | null;
	setUser: (user: AuthStoreState["user"] | null) => void;
	ready: boolean;
	setReady: (ready: boolean) => void;
	signingIn: boolean;
	setSigningIn: (signingIn: boolean) => void;
}

export const authStore = createStore(
	persist<AuthStoreState>(
		(set) => ({
			user: null,
			ready: false,
			setUser: (user) => set({ user }),
			setReady: (ready) => set({ ready }),
			signingIn: false,
			setSigningIn: (signingIn) => set({ signingIn }),
		}),
		{
			name: "simpleci-auth-store",
			partialize: (state) => ({ user: state.user } as AuthStoreState),
		}
	)
);

export const useAuth = () => useStore(authStore);

//#endregion

class AuthProvider {
	private internalAuthProvider: Auth;

	private authStore: typeof authStore;
	private unsubscribeFromAuthChanges: () => void;

	constructor() {
		this.internalAuthProvider = getAuth(firebaseApp);
		this.authStore = authStore;

		this.unsubscribeFromAuthChanges = this.onAuthStateChanged((user) => {
			this.authStore.getState().setReady(true);

			if (!user) return this.authStore.getState().setUser(null);
			this.authStore.getState().setUser({
				displayName: user.displayName,
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL,
				emailVerified: user.emailVerified,
				phoneNumber: user.phoneNumber,
			});
		});
	}

	get gitHubProvider() {
		const gitHubAuthProvider = new GithubAuthProvider();
		gitHubAuthProvider.addScope("repo");
		return gitHubAuthProvider;
	}

	getUserToken = async ({ getFromCache = true } = {}) => {
		if (getFromCache && sessionStorage.getItem("access_token"))
			return sessionStorage.getItem("access_token");
		const token = await getIdToken(
			this.internalAuthProvider.currentUser as User,
			true
		);
		if (token) sessionStorage.setItem("access_token", token);
	};

	loginWithPopup = async (mode: "github") => {
		try {
			const provider = mode === "github" ? this.gitHubProvider : null;
			if (!provider) throw new Error("Invalid sign in mode");
			return {
				data: await signInWithPopup(this.internalAuthProvider, provider),
				error: null,
			};
		} catch (error) {
			return { data: null, error };
		}
	};

	logout = async () => {
		try {
			await signOut(this.internalAuthProvider);
			return { error: null };
		} catch (error) {
			return { error };
		}
	};

	onAuthStateChanged(callback: (user: User | null) => unknown) {
		return onAuthStateChanged(this.internalAuthProvider, callback);
	}

	destroy() {
		this.unsubscribeFromAuthChanges();
	}
}

export default new AuthProvider();
