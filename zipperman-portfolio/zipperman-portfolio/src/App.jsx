import Zipper from './Zipper.jsx'

/* ================= CONFIGURE AQUI ================= */
const SITE = {
  handle: 'itsnorealblack',
  tagline: 'Meus perfis, meus jogos e o que eu curto. Tudo guardado atrás de um zíper.',
}

const LINKS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@itsnorealblack',
    desc: 'Onde eu mais apareço. Segue lá pra não perder nada.',
    cta: 'Seguir no TikTok',
    url: 'https://www.tiktok.com/@itsnorealblack',
  },
  {
    id: 'steam',
    name: 'Steam',
    handle: 'Perfil da Steam',
    desc: 'Meus jogos, conquistas e amigos. Me adiciona e bora jogar.',
    cta: 'Ver perfil na Steam',
    url: 'https://steamcommunity.com/profiles/76561199750341089/',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    handle: 'Perfil do Roblox',
    desc: 'Onde eu jogo YBA. Manda um pedido de amizade.',
    cta: 'Ver perfil no Roblox',
    url: 'https://www.roblox.com/users/10687799084/profile',
  },
]

const GAMES = ['Pyromaniac', 'Cry of Fear', 'YBA (Your Bizarre Adventure), no Roblox']
/* =================================================== */

function Icon({ id }) {
  if (id === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v3.1c-1.4.1-2.7-.3-4-1.1v6.2c0 3.9-3.1 6.2-6.2 5.6-2.7-.5-4.6-3-4.2-5.8.4-2.9 3-4.8 5.9-4.4v3.3c-1.7-.4-3.1.8-3.1 2.2 0 1.6 1.4 2.6 2.9 2.2.9-.3 1.4-1 1.4-2.1V3h3.3z" />
      </svg>
    )
  }
  if (id === 'steam') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-10 9.2l5.4 2.2a3 3 0 0 1 1.7-.5h.2l2.4-3.5v-.1a4 4 0 1 1 4 4h-.1l-3.4 2.5a3 3 0 0 1-5.9.7L2.3 15A10 10 0 1 0 12 2zm-4 15.5-1.2-.5a2.2 2.2 0 1 0 1.2.5zm8.2-6.9a2.5 2.5 0 1 0-2.5-2.5 2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M6.4 2.6 21.4 6.6 17.6 21.4 2.6 17.4zM10.3 10.2l-.9 3.5 3.4.9.9-3.5z"
      />
    </svg>
  )
}

export default function App() {
  return (
    <>
      <header className="top wrap">
        <a href="#topo" className="brand">
          {SITE.handle}
        </a>
        <nav aria-label="Seções">
          <a href="#contas">Contas</a>
          <a href="#curiosidades">Curiosidades</a>
        </nav>
      </header>
      <div className="wrap">
        <div className="zline" aria-hidden="true" />
      </div>

      <main id="topo">
        {/* ---------- HERO ---------- */}
        <section className="hero wrap">
          <div className="hero-text">
            <h1>{SITE.handle}</h1>
            <p className="lead">{SITE.tagline}</p>
            <a className="btn" href="#contas">
              Ver minhas contas
            </a>
          </div>
          <figure className="hero-art">
            <img src="/img/zipperman-arte.png" alt="Zipperman, o Sticky Fingers de Bruno Bucciarati, saindo de dentro de um zíper aberto" />
          </figure>
        </section>

        <div className="wrap">
          <Zipper label="clica no zíper" maxGap={250}>
            <div className="void-row">
              <span className="void-word">Sticky Fingers</span>
              <img src="/img/zipperman.png" alt="Sticky Fingers, o stand de Bucciarati" />
              <span className="void-word">Arrivederci!</span>
            </div>
          </Zipper>
        </div>

        {/* ---------- CONTAS ---------- */}
        <section id="contas" className="section wrap">
          <h2>Minhas contas</h2>
          <p className="section-sub">Cada botão leva direto pro meu perfil, é só seguir ou adicionar.</p>
          <div className="links">
            {LINKS.map((l) => (
              <article className="card" key={l.id}>
                <div className="zline" aria-hidden="true" />
                <div className="card-body">
                  <span className="card-icon">
                    <Icon id={l.id} />
                  </span>
                  <h3>{l.name}</h3>
                  <p className="card-handle">{l.handle}</p>
                  <p>{l.desc}</p>
                  <a className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.cta}
                  </a>
                </div>
                <div className="zline" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <div className="wrap">
          <Zipper label="tem mais aqui dentro" maxGap={190}>
            <p className="void-quote">
              O Sticky Fingers abre zíperes em qualquer superfície: paredes, chão e até pessoas.
            </p>
          </Zipper>
        </div>

        {/* ---------- CURIOSIDADES ---------- */}
        <section id="curiosidades" className="section wrap">
          <h2>Curiosidades sobre mim</h2>
          <p className="section-sub">Umas coisas que dizem bastante sobre quem eu sou.</p>
          <div className="facts">
            <article className="fact fact-anime">
              <div className="zline" aria-hidden="true" />
              <h3>Anime favorito</h3>
              <p className="fact-big">JoJo&apos;s Bizarre Adventure</p>
            </article>

            <article className="fact fact-games">
              <div className="zline" aria-hidden="true" />
              <h3>Jogos favoritos</h3>
              <ul className="drops">
                {GAMES.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </article>

            <article className="fact fact-char">
              <div className="zline" aria-hidden="true" />
              <img src="/img/bucciarati-gotas.png" alt="Zíper aberto sobre o padrão de gotas da roupa do Bucciarati" />
              <h3>Personagem favorito</h3>
              <p className="fact-big">Bruno Bucciarati</p>
              <p>Dono do Sticky Fingers, o stand dos zíperes que deu a ideia deste site.</p>
            </article>
          </div>
        </section>

        <div className="wrap">
          <Zipper label="fecha o site" maxGap={200}>
            <p className="void-finale">Arrivederci!</p>
          </Zipper>
        </div>
      </main>

      <footer className="foot wrap">
        <p>
          {new Date().getFullYear()} {SITE.handle}. Feito com zíperes.
        </p>
      </footer>
    </>
  )
}
