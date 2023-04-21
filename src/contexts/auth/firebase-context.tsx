import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import type { User as FirebaseUser } from '@firebase/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { firebaseApp } from '../../libs/firebase';
import type { User } from '../../types/user';
import {useCollection} from "../../hooks/firebase/useCollection";
import {db} from "../../config";
import {collection, doc, getDoc} from "firebase/firestore";

const auth = getAuth(firebaseApp);

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

enum ActionType {
  AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED'
}

type AuthStateChangedAction = {
  type: ActionType.AUTH_STATE_CHANGED;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type Action = AuthStateChangedAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const reducer = (state: State, action: Action): State => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  }

  return state;
};

export interface AuthContextType extends State {
  issuer: "Firebase";
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: "Firebase",
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAuthStateChanged = useCallback(
    async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Here you should extract the complete user profile to make it available in your entire app.
        // The auth state only provides basic information.
        // @ts-ignore
        const userRef = doc(
            db,
            'tenants',
            firebaseUser.tenantId,
            'users',
            firebaseUser.uid)
        const user = await getDoc(userRef).then((doc) => doc.data());

        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: true,
            user: {
              id: firebaseUser.uid,
              tenantID: firebaseUser.tenantId ?? '',
              email: user?.email,
              firstName: user?.firstName,
              lastName: user?.lastName,
              role: user?.role,
              targetMembership: user?.targetMembership,
              imageURL: user?.imageURL,
              phone: user?.phone,
              isActive: user?.isActive,
              groupsMemberOf: user?.groupsMemberOf,
            }
          }
        });
      } else {
        dispatch({
          type: ActionType.AUTH_STATE_CHANGED,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    },
    [dispatch]
  );

  useEffect(
    () => onAuthStateChanged(auth, handleAuthStateChanged),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const _signInWithEmailAndPassword = useCallback(
    async (email: string, password: string): Promise<void> => {
      auth.tenantId = 'ParkTudorSchoolDev-fse0k';
      await signInWithEmailAndPassword(auth, email, password);
    },
    []
  );

  const signInWithGoogle = useCallback(
    async (): Promise<void> => {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);
    },
    []
  );

  const _createUserWithEmailAndPassword = useCallback(
    async (email: string,
      password: string): Promise<void> => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    []
  );

  const _signOut = useCallback(
    async (): Promise<void> => {
      await signOut(auth);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: "Firebase",
        createUserWithEmailAndPassword: _createUserWithEmailAndPassword,
        signInWithEmailAndPassword: _signInWithEmailAndPassword,
        signInWithGoogle,
        signOut: _signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
