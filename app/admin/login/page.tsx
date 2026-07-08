export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <main className="public-page">
      <section className="container narrow">
        <form className="card form" action="/api/auth/login" method="post">
          <div>
            <p className="muted">Area do organizador</p>
            <h1>Entrar no painel</h1>
          </div>
          <label className="field">
            <span>Senha</span>
            <input className="input" name="password" required type="password" autoFocus />
          </label>
          <button className="button primary" type="submit">
            Entrar
          </button>
          <LoginError searchParams={searchParams} />
        </form>
      </section>
    </main>
  );
}

async function LoginError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return params.error ? <div className="notice error">Senha invalida.</div> : null;
}
