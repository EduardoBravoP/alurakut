import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AlurakutStyles } from '../lib/AlurakutCommons'

const theme = {
  colors: {
    white: '#fff',
    primary: '#D9E6F6'
  },
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    background-color: ${theme.colors.primary};
  }

  #__next {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .profilePicture {
    border-radius: 8px;
  }

  ${AlurakutStyles}
`

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
