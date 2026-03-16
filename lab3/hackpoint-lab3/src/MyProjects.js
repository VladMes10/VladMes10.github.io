import React from 'react';

const myProjectsData = [
  { 
    id: 1, 
    name: "MedScan AI", 
    comp: "AI Innovation 2026", 
    status: "У РОЗРОБЦІ", 
    statusClass: "status-process",
    action: "Редагувати"
  },
  { 
    id: 2, 
    name: "Оптимізація графів", 
    comp: "Algorithm Masters", 
    status: "ПРИЙНЯТО", 
    statusClass: "status-done",
    action: "Переглянути"
  },
  { 
    id: 3, 
    name: "EcoMonitor Portal", 
    comp: "Web Masters", 
    status: "ВІДПРАВЛЕНО", 
    statusClass: "status-pending",
    action: "Переглянути",
    hasCancel: true // Додаю прапорець для кнопки скасування
  }
];

function MyProjects() {
  return (
    <section id="projects">
      <div className="section-header">
        <h2>Мої проєкти та заявки</h2>
      </div>

      <div id="projects-list-container" className="project-board">
        <p style={{ color: '#000000', marginBottom: '20px' }}>
          Керуйте своїми реєстраціями проєктів на змагання та відстежуйте статус поданих проєктів.
        </p>
        
        {myProjectsData.map(project => (
          <article key={project.id} className="project-item">
            <div className="project-info">
              <strong>{project.name}</strong>
              <p>Змагання: {project.comp}</p>
            </div>
            
            <span className={`status ${project.statusClass}`}>
              {project.status}
            </span>
            
            <div className="project-actions">
              <button className="btn-primary">
                {project.action}
              </button>
              {project.hasCancel && (
                <button className="btn-secondary">Скасувати</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MyProjects;