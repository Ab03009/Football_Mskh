import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const initialTeams = [
    "Off", "Galactikus", "Dracarys", "Renes", 
    "Երեք Ոզնի", "Գենացվալե", "Շրջանավարտներ", "Red Storms"
  ];

  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    const pass = prompt("գրել գաղտնաբառը:");
    if (pass === "Rob03009") {
      setIsAdmin(true);
    } else {
      alert("Սխալ գաղտնաբառ!");
    }
  };

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('ec26_v4_matches');
    if (saved) return JSON.parse(saved);
    return [
      { id: 't1-1', round: 1, home: "Off", away: "Galactikus", date: '2026-04-13', time: '14:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't1-2', round: 1, home: "Dracarys", away: "Renes", date: '2026-04-13', time: '15:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't1-3', round: 1, home: "Երեք Ոզնի", away: "Գենացվալե", date: '2026-04-13', time: '16:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't1-4', round: 1, home: "Red Storms", away: "Շրջանավարտներ", date: '2026-04-13', time: '17:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't2-1', round: 2, home: "Off", away: "Dracarys", date: '2026-04-14', time: '14:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't2-2', round: 2, home: "Galactikus", away: "Երեք Ոզնի", date: '2026-04-14', time: '15:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't2-3', round: 2, home: "Renes", away: "Շրջանավարտներ", date: '2026-04-14', time: '16:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't2-4', round: 2, home: "Գենացվալե", away: "Red Storms", date: '2026-04-14', time: '17:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't3-1', round: 3, home: "Off", away: "Երեք Ոզնի", date: '2026-04-15', time: '14:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't3-2', round: 3, home: "Galactikus", away: "Renes", date: '2026-04-15', time: '15:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't3-3', round: 3, home: "Dracarys", away: "Red Storms", date: '2026-04-15', time: '16:00', homeScore: 0, awayScore: 0, status: 'pending' },
      { id: 't3-4', round: 3, home: "Գենացվալե", away: "Շրջանավարտներ", date: '2026-04-15', time: '17:00', homeScore: 0, awayScore: 0, status: 'pending' },
    ];
  });

  const [scorers, setScorers] = useState(() => JSON.parse(localStorage.getItem('ec26_v4_scorers')) || {});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentScorer, setCurrentScorer] = useState('');
  
  // Временные стейты для изменения даты и времени
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');

  useEffect(() => {
    localStorage.setItem('ec26_v4_matches', JSON.stringify(matches));
    localStorage.setItem('ec26_v4_scorers', JSON.stringify(scorers));
  }, [matches, scorers]);

  useEffect(() => {
    if (selectedMatch) {
      setTempDate(selectedMatch.date);
      setTempTime(selectedMatch.time);
    }
  }, [selectedMatch]);

  const getStandings = () => {
    const table = {};
    initialTeams.forEach(t => table[t] = { name: t, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    matches.filter(m => m.status === 'finished').forEach(m => {
      const h = table[m.home], a = table[m.away];
      h.mp++; a.mp++; h.gf += m.homeScore; h.ga += m.awayScore; a.gf += m.awayScore; a.ga += m.homeScore;
      if (m.homeScore > m.awayScore) { h.w++; h.pts += 3; a.l++; }
      else if (m.homeScore < m.awayScore) { a.w++; a.pts += 3; h.l++; }
      else { h.d++; a.d++; h.pts += 1; a.pts += 1; }
    });
    return Object.values(table).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
  };

  const confirmMatch = () => {
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id 
      ? { ...m, status: 'finished', date: tempDate, time: tempTime } 
      : m
    ));
    setSelectedMatch(null);
  };

  const addGoal = (isHome) => {
    if (!currentScorer.trim()) return alert("Խաղացողի անունը");
    const team = isHome ? selectedMatch.home : selectedMatch.away;
    setScorers(prev => ({ ...prev, [currentScorer]: { goals: (prev[currentScorer]?.goals || 0) + 1, team } }));
    setMatches(prev => prev.map(m => 
      m.id === selectedMatch.id 
      ? { ...m, [isHome ? 'homeScore' : 'awayScore']: m[isHome ? 'homeScore' : 'awayScore'] + 1 } 
      : m
    ));
    setSelectedMatch(prev => ({ ...prev, [isHome ? 'homeScore' : 'awayScore']: prev[isHome ? 'homeScore' : 'awayScore'] + 1 }));
    setCurrentScorer('');
  };

  const standings = getStandings();

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="main-header">
          <div className="brand">
            <h1 className="logo"> «Դավիթ Գևորգյան»<span>ամենամյա ֆուտբոլային մրցաշար</span></h1>
            <div className="season-tag">Admin: {isAdmin ? "🔓 Edit Mode" : "🔒 Read Only"}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isAdmin ? (
              <button className="reset-btn" onClick={handleAdminLogin} style={{ background: '#red' }}>ADMIN LOGIN</button>
            ) : (
              <button className="reset-btn" onClick={() => setIsAdmin(false)}>LOGOUT</button>
            )}
            {isAdmin && (
              <button className="reset-btn" onClick={() => {if(confirm("RESET ALL DATA?")) {localStorage.clear(); window.location.reload();}}}>RESET</button>
            )}
          </div>
        </header>

        <main className="tournament-grid">
          <div className="main-feed">
            <section className="section-card table-section">
              <div className="card-header"><h2>Աղյուսակ</h2></div>
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr><th>#</th><th>Թիմ</th><th>Խ</th><th>Հ</th><th>Ո</th><th>Պ</th><th>+ -</th><th className="pts-head">Մ</th></tr>
                  </thead>
                  <tbody>
                    {standings.map((t, i) => {
                      // Логика цветов строк
                      let rowClass = "";
                      if (i < 2) rowClass = "zone-sf"; // Полуфинал (Зеленый в твоем CSS)
                      else if (i >= 2 && i < 6) rowClass = "zone-ko"; // Стыки (Сделаем фиолетовым)
                      else if (i === standings.length - 1) rowClass = "zone-out"; // Последнее место (Красный)

                      return (
                        <tr key={i} className={rowClass}>
                          <td className="pos-cell">{i+1}</td>
                          <td className="name-cell">{t.name}</td>
                          <td>{t.mp}</td><td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
                          <td className="gd-cell">{t.gf}-{t.ga}</td>
                          <td className="pts-cell highlight">{t.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="rounds-container">
              {[1, 2, 3].map(r => (
                <section key={r} className="section-card round-box">
                  <h3>Փուլ {r}</h3>
                  <div className="matches-grid">
                    {matches.filter(m => m.round === r).map(m => (
                      <div 
                        key={m.id} 
                        className={`match-card ${m.status}`} 
                        onClick={() => isAdmin ? setSelectedMatch(m) : null}
                        style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                      >
                        <div className="match-meta"><span>{m.date}</span><span>{m.time}</span></div>
                        <div className="match-body">
                          <span className="team-n">{m.home}</span>
                          <div className="score-badge">{m.status === 'finished' ? `${m.homeScore}:${m.awayScore}` : 'VS'}</div>
                          <span className="team-n text-right">{m.away}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="sidebar">
            <div className="section-card scorers-card">
              <h3>Ռմբարկուներ</h3>
              <div className="scorers-list">
                {Object.entries(scorers).sort((a,b) => b[1].goals - a[1].goals).map(([name, d], i) => (
                  <div key={i} className="scorer-row">
                    <div className="rank">{i+1}</div>
                    <div className="p-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="p-name" style={{ fontWeight: '800', fontSize: '0.95rem', color: '#fff' }}>{name}</span>
                      <span className="p-team" style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>{d.team}</span>
                    </div>
                    <div className="p-goals">{d.goals}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        {selectedMatch && isAdmin && (
          <div className="modal-overlay">
            <div className="modal-box glass">
              <button className="close-btn" onClick={() => setSelectedMatch(null)}>×</button>
              
              {/* РЕДАКТИРОВАНИЕ ДАТЫ И ВРЕМЕНИ */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '5px' }}>Օր</label>
                  <input type="text" value={tempDate} onChange={(e) => setTempDate(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '5px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '5px' }}>Ժամանակ</label>
                  <input type="text" value={tempTime} onChange={(e) => setTempTime(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '5px' }} />
                </div>
              </div>

              <div className="score-display">
                <span className="t-name">{selectedMatch.home}</span>
                <div className="big-score">{selectedMatch.homeScore}:{selectedMatch.awayScore}</div>
                <span className="t-name text-right">{selectedMatch.away}</span>
              </div>

              <div className="goal-controls">
                <input 
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #004400', color: '#fff', borderRadius: '8px', marginBottom: '10px' }}
                  placeholder="Ռմբարկուի անունը..." 
                  value={currentScorer} 
                  onChange={(e) => setCurrentScorer(e.target.value)} 
                />
                <div className="goal-btns" style={{ display: 'flex', gap: '10px' }}>
                  <button className="confirm-match-btn" style={{ margin: 0 }} onClick={() => addGoal(true)}>+ {selectedMatch.home}</button>
                  <button className="confirm-match-btn" style={{ margin: 0 }} onClick={() => addGoal(false)}>+ {selectedMatch.away}</button>
                </div>
              </div>
              <button className="confirm-match-btn" style={{ marginTop: '20px', background: '#00ff00', color: '#000' }} onClick={confirmMatch}>Հաստատել և փակել</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;