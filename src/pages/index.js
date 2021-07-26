import Image from 'next/image'

import MainGrid from '../components/MainGrid'
import Box from '../components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../lib/AlurakutCommons'
import Link from 'next/link'
import { ProfileRelationsBoxWrapper } from '../components/ProfileRelations'

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
    </Box>
  )
}

export default function Home() {
  const githubUser = 'eduardobravop'
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  return (
    <>
      <AlurakutMenu />

      <MainGrid>
        <div className="profile" style={{ gridArea: 'profile' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcome" style={{ gridArea: 'welcome' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>

        <div className="profileRelations" style={{ gridArea: 'profileRelations' }}>
          <ProfileRelationsBoxWrapper>
            <h2
              className="smallTitle"
            >
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((person) => (
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
