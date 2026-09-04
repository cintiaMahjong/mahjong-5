import logo from "../assets/logo.png";

function HomePage({
  hasActiveGame,
  onNewGame,
  onContinueGame,
  onHistory,
  onStatistics,
  language,
  setLanguage,
  t
}) {

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "25px 20px 40px",
        textAlign: "center"
      }}
    >

      {/* =========================================
          SELECTOR DE IDIOMA
      ========================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          marginBottom: "25px",
          whiteSpace: "nowrap"
        }}
      >

        {/* ESPAÑOL */}
        <button
          onClick={() => setLanguage("es")}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border:
              language === "es"
                ? "2px solid #D4AF37"
                : "1px solid rgba(255,255,255,.35)",
            background:
              language === "es"
                ? "rgba(212,175,55,.18)"
                : "transparent",
            color: "white",
            fontSize: "13px",
            fontWeight:
              language === "es"
                ? "bold"
                : "normal",
            cursor: "pointer"
          }}
        >
          🇪🇸 ES
        </button>

        {/* INGLÉS */}
        <button
          onClick={() => setLanguage("en")}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border:
              language === "en"
                ? "2px solid #D4AF37"
                : "1px solid rgba(255,255,255,.35)",
            background:
              language === "en"
                ? "rgba(212,175,55,.18)"
                : "transparent",
            color: "white",
            fontSize: "13px",
            fontWeight:
              language === "en"
                ? "bold"
                : "normal",
            cursor: "pointer"
          }}
        >
          🇬🇧 EN
        </button>

        {/* CHINO SIMPLIFICADO */}
        <button
          onClick={() => setLanguage("ch")}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border:
              language === "ch"
                ? "2px solid #D4AF37"
                : "1px solid rgba(255,255,255,.35)",
            background:
              language === "ch"
                ? "rgba(212,175,55,.18)"
                : "transparent",
            color: "white",
            fontSize: "13px",
            fontWeight:
              language === "ch"
                ? "bold"
                : "normal",
            cursor: "pointer"
          }}
        >
          🇨🇳 CH
        </button>

        {/* CHINO TRADICIONAL */}
        <button
          onClick={() => setLanguage("zh")}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border:
              language === "zh"
                ? "2px solid #D4AF37"
                : "1px solid rgba(255,255,255,.35)",
            background:
              language === "zh"
                ? "rgba(212,175,55,.18)"
                : "transparent",
            color: "white",
            fontSize: "13px",
            fontWeight:
              language === "zh"
                ? "bold"
                : "normal",
            cursor: "pointer"
          }}
        >
          🇹🇼 ZH
        </button>

      </div>

      {/* =========================================
          LOGO MAHJONG MADRID
      ========================================= */}

      <img
        src={logo}
        alt="Mahjong Madrid"
        style={{
          width: "220px",
          maxWidth: "80%",
          height: "auto",
          display: "block",
          margin: "0 auto 20px"
        }}
      />

      {/* =========================================
          TÍTULO
      ========================================= */}

      <h1>
        {t.appTitle}
      </h1>

      {/* =========================================
          SUBTÍTULO
      ========================================= */}

      <p
        style={{
          marginBottom: "35px",
          opacity: 0.8
        }}
      >
        {t.appSubtitle}
      </p>

      {/* =========================================
          CONTINUAR PARTIDA
      ========================================= */}

      {hasActiveGame && (
        <button
          onClick={onContinueGame}
          style={{
            width: "100%",
            padding: "17px",
            marginBottom: "12px",
            fontSize: "19px",
            fontWeight: "bold",
            background: "#D4AF37",
            color: "#222",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer"
          }}
        >
          ▶️ {t.continueGame}
        </button>
      )}

      {/* =========================================
          NUEVA PARTIDA
      ========================================= */}

      <button
        onClick={onNewGame}
        style={{
          width: "100%",
          padding: "17px",
          marginBottom: "12px",
          fontSize: "19px",
          fontWeight: "bold",
          background: hasActiveGame
            ? "#ffffff"
            : "#D4AF37",
          color: "#222",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        ➕ {t.newGame}
      </button>

      {/* =========================================
          HISTORIAL
      ========================================= */}

      <button
        onClick={onHistory}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "transparent",
          color: "white",
          border:
            "2px solid rgba(255,255,255,.5)",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        📚 {t.history}
      </button>

      {/* =========================================
          ESTADÍSTICAS
      ========================================= */}

      <button
        onClick={onStatistics}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          background: "transparent",
          color: "white",
          border:
            "2px solid rgba(255,255,255,.5)",
          borderRadius: "12px",
          cursor: "pointer"
        }}
      >
        📊 {t.statistics}
      </button>

      {/* =========================================
          COPYRIGHT
      ========================================= */}

      <footer
        style={{
          marginTop: "45px",
          paddingTop: "15px",
          borderTop:
            "1px solid rgba(255,255,255,.2)",
          fontSize: "12px",
          color:
            "rgba(255,255,255,.6)"
        }}
      >
        {t.copyright}
      </footer>

    </div>
  );
}

export default HomePage;
