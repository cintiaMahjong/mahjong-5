function PointsStep({
  handPoints,
  setHandPoints,
  onSave
}) {
  function handleChange(e) {
    const value = e.target.value;

    // Permitir vacío para poder borrar
    if (value === "") {
      setHandPoints("");
      return;
    }

    // Solo números enteros
    if (/^\d+$/.test(value)) {
      setHandPoints(value);
    }
  }

  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        Puntos de la mano
      </h2>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={handPoints}
        onChange={handleChange}
        placeholder="Mínimo 8"
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "24px",
          textAlign: "center",
          marginBottom: "20px",
          boxSizing: "border-box"
        }}
      />

      <button
        onClick={onSave}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#D4AF37",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Guardar mano
      </button>
    </>
  );
}

export default PointsStep;