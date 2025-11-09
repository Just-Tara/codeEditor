import {createContext, useState, useEffect} from 'react';

export const ThemeCntext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect (() => {
        if (theme ===  "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classlist.remove("dark")
        }
        localStorage.setItem("theme", theme)
    }, [theme]);

    return(
        <ThemeCntext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeCntext.Provider>
    )
}