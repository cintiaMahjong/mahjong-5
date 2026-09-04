function Ranking({ players, t }) {

  // Ordenar SIEMPRE de mayor a menor puntuación
  const ranking = [...players].sort(
    (a, b) => b.points - a.points
  );

  const medal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}º`;
  };

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#222",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)"
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          textAlign: "center"
        }}
      >
        🏆 {t.ranking}
      </h3>

      {ranking.map((player, index) => (
        <div
          key={player.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 0",
            borderBottom:
              index !== ranking.length - 1
                ? "1px solid #eee"
                : "none"
          }}
        >
          <div>
            {medal(index)} {player.name}
          </div>

          <div
            style={{
              fontWeight: "bold",
              color:
                player.points > 0
                  ? "#0a8f3d"
                  : player.points < 0
                  ? "#c62828"
                  : "#444"
            }}
          >
            {player.points > 0 ? "+" : ""}
            {player.points}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Ranking;