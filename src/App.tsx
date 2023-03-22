import { store } from './store'
import { Provider } from 'react-redux'
import {AuthConsumer, AuthProvider} from "./contexts/auth/firebase-context";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {createTheme} from "./theme";
import {Helmet} from "react-helmet-async";
import {useRoutes} from "react-router-dom";
import {routes} from "./routes";
import {Toaster} from "react-hot-toast";
import {SettingsConsumer, SettingsProvider} from "./contexts/settings/settings-context";
import {SplashScreen} from "./components/splash-screen";

function App() {

    const element = useRoutes(routes);

    return (
        <Provider store={store}>
            <AuthProvider>
                <AuthConsumer>
                    {auth => (
                        <SettingsProvider>
                            <SettingsConsumer>
                                {(settings) => {
                                    // Prevent theme flicker when restoring custom settings from browser storage
                                    if (!settings.isInitialized) {
                                        // return null;
                                    }

                                    const theme = createTheme({
                                        colorPreset: settings.colorPreset,
                                        contrast: settings.contrast,
                                        direction: settings.direction,
                                        paletteMode: settings.paletteMode,
                                        responsiveFontSizes: settings.responsiveFontSizes
                                    });

                                    // Prevent guards from redirecting
                                    const showSlashScreen = !auth.isInitialized;

                                    return (
                                        <ThemeProvider theme={theme}>
                                            <Helmet>
                                                <meta
                                                    name="color-scheme"
                                                    content={settings.paletteMode}
                                                />
                                                <meta
                                                    name="theme-color"
                                                    content={theme.palette.neutral[900]}
                                                />
                                            </Helmet>
                                            <CssBaseline />
                                            {
                                                showSlashScreen
                                                    ? <SplashScreen />
                                                    : (
                                                        <>
                                                            {element}
                                                        </>
                                                    )
                                            }
                                            <Toaster />
                                        </ThemeProvider>
                                    );
                                }}
                            </SettingsConsumer>
                        </SettingsProvider>
                    )}
                </AuthConsumer>
            </AuthProvider>
        </Provider>
    )
}

export default App
