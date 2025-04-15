const { useState, useEffect } = React;

const App = () => {
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fs.readFile('ivg_dati.json', { encoding: 'utf8' });
        const jsonData = JSON.parse(response);
        setData(jsonData);
        
        // Estrai l'elenco unico delle province e ordinalo alfabeticamente
        const uniqueProvinces = [...new Set(jsonData.map(item => item.provincia))].sort();
        setProvinces(uniqueProvinces);
        
        // Non selezionare alcuna provincia di default
        setSelectedProvince('');
        
        setLoading(false);
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const filtered = data.filter(item => item.provincia === selectedProvince);
      // Ordina per nome della struttura
      filtered.sort((a, b) => a.struttura.localeCompare(b.struttura));
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [selectedProvince, data]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  if (loading) {
    return <div className="loading">Caricamento dati in corso...</div>;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Le strutture dove si effettuano IVG</h1>
        <p className="subtitle">Dati al 2023 - Fonte: Istat via Epicentro</p>
      </div>
      
      <div className="selector">
        <label htmlFor="province-select">Scegli una provincia per visualizzare le strutture:</label>
        <select 
          id="province-select"
          value={selectedProvince}
          onChange={handleProvinceChange}
        >
          <option value="">-- Seleziona una provincia --</option>
          {provinces.map(province => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>
      
      <div className="structures-container">
        {!selectedProvince ? (
          <></>
        ) : filteredData.length === 0 ? (
          <p>Nessuna struttura trovata per la provincia selezionata.</p>
        ) : (
          <div className="structures-list">
            {filteredData.map((item, index) => (
              <div key={index} className="structure-card">
                <p className="structure-name">{item.struttura}</p>
                <p className="structure-address">{item.indirizzo}</p>
                <p className="structure-info">IVG eseguite nel 2023: {item.totale_ivg}</p>
                <p className="structure-info">% IVG farmacologiche: {item.percentuale_farmacologiche}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
