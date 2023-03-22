import { useContext } from 'react';
import { AuthContext } from '../contexts/auth/firebase-context'
export const useAuth = () => useContext(AuthContext);
