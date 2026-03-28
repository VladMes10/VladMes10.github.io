import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

function MyProjects() {
  const [projects, setProjects] = useState([]); 
  const [userRegistrations, setUserRegistrations] = useState([]); // Стан для списку зареєстрованих змагань
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Універсальний стан для модального вікна
  const [modal, setModal] = useState({ 
    show: false, title: '', message: '', type: 'info', project: null, onConfirm: null 
  });

  // Стани для полів форми
  const [projectName, setProjectName] = useState('');
  const [competition, setCompetition] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [description, setDescription] = useState('');

  // Очищення полів
  const resetFormFields = () => {
    setProjectName('');
    // Ставлю за замовчуванням перше доступне змагання зі списку
    setCompetition(userRegistrations[0] || '');
    setGithubLink('');
    setDescription('');
  };

  const fetchData = async () => {
    if (!auth.currentUser) return;
    try {
      const uid = auth.currentUser.uid;

      // 1. Завантажую проєкти користувача
      const qProjects = query(collection(db, "user_projects"), where("userId", "==", uid));
      const querySnapshot = await getDocs(qProjects);
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);

      // 2. Завантажую тільки ті змагання, на які користувач зареєструвався
      const qRegs = query(collection(db, "registrations"), where("userId", "==", uid));
      const snapRegs = await getDocs(qRegs);
      
      // Сортування назв змагань за алфавітом
      const regs = snapRegs.docs
        .map(doc => doc.data().competitionTitle)
        .sort((a, b) => a.localeCompare(b));
        
      setUserRegistrations(regs);
      if (regs.length > 0) setCompetition(regs[0]);

      setLoading(false);
    } catch (error) { 
      console.error("Помилка завантаження:", error);
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const formatUrl = (url) => {
    if (!url || url.trim() === "") return "";
    const cleanUrl = url.trim();
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      return setModal({ show: true, title: "Увага", message: "Будь ласка, введіть назву проєкту!", type: 'info' });
    }

    const newProject = {
      userId: auth.currentUser.uid,
      name: projectName.trim(),
      comp: competition,
      github: githubLink.trim() ? formatUrl(githubLink) : "",
      desc: description.trim(),
      status: "ВІДПРАВЛЕНО",
      statusClass: "status-pending",
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "user_projects"), newProject);
      resetFormFields();
      setShowForm(false);
      fetchData(); // Оновлюю дані
      setModal({ show: true, title: "Успішно", message: "Ваш проєкт успішно надіслано!", type: 'info' });
    } catch (error) { 
      setModal({ show: true, title: "Помилка", message: error.message, type: 'info' }); 
    }
  };

  const handleUpdate = async () => {
    try {
      const projectRef = doc(db, "user_projects", modal.project.id);
      await updateDoc(projectRef, {
        name: projectName,
        comp: competition,
        github: formatUrl(githubLink) || "",
        desc: description
      });
      setModal({ ...modal, show: false });
      resetFormFields();
      fetchData();
    } catch (e) { 
        setModal({ show: true, title: "Помилка", message: "Не вдалося оновити дані", type: 'info' });
    }
  };

  const deleteProject = async (id) => {
    try {
      await deleteDoc(doc(db, "user_projects", id));
      setModal({ show: false, title: '', message: '', type: 'info', project: null });
      fetchData();
    } catch (e) { 
        setModal({ show: true, title: "Помилка", message: "Помилка при видаленні", type: 'info' });
    }
  };

  const startEdit = (project) => {
    setProjectName(project.name);
    setCompetition(project.comp);
    setGithubLink(project.github || '');
    setDescription(project.desc || '');
    setModal({ show: true, title: "Редагування проєкту", type: 'edit', project: project });
  };

  if (loading) return <div className="container" style={{padding: '50px', textAlign: 'center'}}><h2>Завантаження...</h2></div>;

  return (
    <section id="projects">
      {/* МОДАЛЬНЕ ВІКНО */}
      {modal.show && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="modal-content" style={{ background: '#1a1a2e', padding: '30px', borderRadius: '15px', border: '2px solid #e94560', color: 'white', width: '95%', maxWidth: '500px', textAlign: 'center' }}>
            <h3 style={{ color: '#e94560', marginBottom: '20px' }}>{modal.title}</h3>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '25px', paddingRight: '10px' }}>
              {modal.type === 'edit' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                  <label style={{color: '#e94560', fontSize: '16px', fontWeight: 'bold'}}>Назва проєкту:</label>
                  <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
                  
                  <label style={{color: '#e94560', fontSize: '16px', fontWeight: 'bold'}}>Змагання:</label>
                  <select value={competition} onChange={(e) => setCompetition(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }}>
                    {/* Виводжу тільки зареєстровані змагання */}
                    {userRegistrations.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>

                  <label style={{color: '#e94560', fontSize: '16px', fontWeight: 'bold'}}>GitHub посилання:</label>
                  <input type="text" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
                  
                  <label style={{color: '#e94560', fontSize: '16px', fontWeight: 'bold'}}>Опис проєкту:</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', color: '#000' }} />
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '18px', textAlign: 'center' }}>{modal.message || modal.project?.desc}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {modal.type === 'edit' && <button className="btn-primary" onClick={handleUpdate}>Зберегти</button>}
              {modal.type === 'confirm' && <button className="btn-primary" onClick={modal.onConfirm}>Так, видалити</button>}
              <button className="btn-secondary" onClick={() => { setModal({ ...modal, show: false }); resetFormFields(); }}>
                {modal.type === 'confirm' ? 'Скасувати' : 'Закрити'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Мої проєкти та заявки</h2>
        <button className="btn-primary" onClick={() => { 
          if(!showForm) resetFormFields(); 
          setShowForm(!showForm); 
        }}>
          {showForm ? 'Скасувати подачу' : '+ Подати проєкт'}
        </button>
      </div>

      <div className="project-board">
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #ddd' }}>
            <h3 style={{ margin: 0, color: '#1a1a2e', textAlign: 'center' }}>Подача нового проєкту</h3>
            
            {/* Перевірка: чи є реєстрації */}
            {userRegistrations.length > 0 ? (
              <>
                <input type="text" placeholder="Назва проєкту" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ padding: '14px', borderRadius: '10px' }} />
                <select value={competition} onChange={(e) => setCompetition(e.target.value)} style={{ padding: '14px', borderRadius: '10px' }}>
                  {userRegistrations.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                <input type="text" placeholder="GitHub посилання (необов'язково)" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} style={{ padding: '14px', borderRadius: '10px' }} />
                <textarea placeholder="Короткий опис вашої ідеї..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '14px', borderRadius: '10px', minHeight: '120px' }} />
                <button type="submit" className="btn-primary" style={{padding: '15px', fontWeight: 'bold'}}>Надіслати проєкт</button>
              </>
            ) : (
              <div style={{textAlign: 'center', padding: '20px'}}>
                <p style={{color: '#e94560', fontWeight: 'bold'}}>Ви не зареєстровані на жодне змагання!</p>
                <p>Перейдіть у розділ "Змагання", щоб подати заявку на участь.</p>
              </div>
            )}
          </form>
        )}

        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '50px', color: '#666', fontSize: '18px' }}>У вас ще немає поданих проєктів.</p>
        ) : (
          projects.map(project => (
            <article key={project.id} className="project-item" style={{padding: '25px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div className="project-info">
                <strong style={{fontSize: '20px'}}>{project.name}</strong>
                <p style={{margin: '5px 0'}}>Змагання: {project.comp}</p>
                {project.github && project.github !== "" && (
                  <small><a href={formatUrl(project.github)} target="_blank" rel="noreferrer" style={{ color: '#e94560', fontWeight: 'bold', textDecoration: 'none' }}>🔗 GitHub Repo</a></small>
                )}
              </div>
              <span className="status status-pending" style={{fontWeight: 'bold', padding: '8px 15px', borderRadius: '20px'}}>ВІДПРАВЛЕНО</span>
              <div className="project-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => startEdit(project)}
                  style={{
                    background: '#4ecca3',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#45b393'}
                  onMouseOut={(e) => e.target.style.background = '#4ecca3'}
                >
                  Редагувати
                </button>
                <button className="btn-secondary" style={{ marginLeft: '10px' }} onClick={() => setModal({ 
                  show: true, 
                  title: "Видалення", 
                  message: `Ви дійсно хочете видалити проєкт "${project.name}"?`, 
                  type: 'confirm', 
                  onConfirm: () => deleteProject(project.id) 
                })}>Скасувати</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default MyProjects;