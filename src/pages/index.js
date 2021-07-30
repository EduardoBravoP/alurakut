import Image from 'next/image'

import MainGrid from '../components/MainGrid'
import Box from '../components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../lib/AlurakutCommons'
import Link from 'next/link'
import { ProfileRelationsBoxWrapper } from '../components/ProfileRelations'
import { useEffect, useState } from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'

function ProfileSidebar({ githubUser }) {
  return (
    <Box>
      <Image
        src={`https://github.com/${githubUser}.png`}
        height={50}
        width={50}
        layout="responsive"
        className="profilePicture"
      />

      <hr />

      <Link href={`https://github.com/${githubUser}`}>
        <a className="boxLink">
          @{githubUser}
        </a>
      </Link>

      <hr />

      <	AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox({ title, items }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home({ githubUser }) {
  const [communities, setCommunities] = useState([])
  const [seguidores, setSeguidores] = useState([]);

  useEffect(async () => {
    fetch('https://api.github.com/users/eduardobravop/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })


    let response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': process.env.NEXT_PUBLIC_DATO_API_KEY_READONLY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "query": `
        query {
          allCommunities {
            title
            id
            imageUrl
          }
        }
      ` })
    })

    response = await response.json()

    setCommunities(response.data.allCommunities)
  }, [])

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const community = {
      title: formData.get('title'),
      image_url: formData.get('image')
    }

    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(community)
    })
      .then(async response => {
        const dados = await response.json()

        setCommunities(oldCommunities => [...oldCommunities, dados.registroCriado])
      })

  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />

      <MainGrid>
        <div className="profile" style={{ gridArea: 'profile' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcome" style={{ gridArea: 'welcome' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que voce deseja fazer?</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelations" style={{ gridArea: 'profileRelations' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({communities.length})
            </h2>
            <ul>
              {communities.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2
              className="smallTitle"
            >
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.slice(0, 6).map((person) => (
                <li key={person}>
                  <Link href={`/users/${person}`}>
                    <a>
                      <img src={`https://github.com/${person}.png`} alt={person} />
                      <span>{person}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
    .then((resposta) => resposta.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}