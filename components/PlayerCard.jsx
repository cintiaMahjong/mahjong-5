function PlayerCard({ player, t }) {
  let pointsColor = "#666";

  if (player.points > 0) pointsColor = "#1E8E3E";
  if (player.points < 0) pointsColor = "#D93025";

  // -----------------------------------------
  // NOMBRE TRADUCIDO DEL VIENTO
  // -----------------------------------------
  const getWindName = (wind) => {
    if (wind === "ESTE") return t.windEast;
    if (wind === "SUR") return t.windSouth;
    if (wind === "OESTE") return t.windWest;
    if (wind === "NORTE") return t.windNorth;

    return t.rest;
  };

  const windText = getWindName(player.wind);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        border: "1px solid #d9d9d9",
        borderRadius: "10px",
        padding: "10px 14px",
        marginBottom: "8px"
      }}
    >
      <div>
        <div
          style={{
            fontSize: "19px",
            fontWeight: "700",
            color: "#222"
          }}
        >
          {player.name}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: "4px",
            padding: "2px 8px",
            borderRadius: "10px",
            background: "#f3f3f3",
            color: "#666",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}
        >
          {windText}
        </div>
      </div>

      <div
        style={{
          textAlign: "right"
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: pointsColor,
            lineHeight: "28px"
          }}
        >
          {player.points > 0 ? "+" : ""}
          {player.points}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#888"
          }}
        >
          {t.points}
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;