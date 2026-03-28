import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usuariosAPI, certificadosAPI, usuarioDashboardAPI, progressoAPI, cursosAPI } from '../../services/api';
import Header from '../Header/Header';

const Perfil = () => {
  const { usuario, login, token } = useAuth();
  const [aba, setAba] = useState('perfil');
  const [justificativa, setJustificativa] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const [editando, setEditando] = useState(false);
  const [nomeEdit, setNomeEdit] = useState(usuario?.nome || '');

  const [certificados, setCertificados] = useState([]);
  const [certLoading, setCertLoading] = useState(false);

  const [stats, setStats] = useState(null);

  // Progresso
  const [cursosProgresso, setCursosProgresso] = useState([]);
  const [progressoLoading, setProgressoLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      carregarStats();
      carregarCertificados();
    }
  }, [usuario]);

  // Recarrega stats e progresso sempre que muda de aba
  useEffect(() => {
    if (usuario) {
      carregarStats();
      if (aba === 'progresso') carregarProgresso();
      if (aba === 'certificados') carregarCertificados();
    }
  }, [aba]);

  const carregarStats = async () => {
    try {
      const res = await usuarioDashboardAPI.dashboard();
      setStats(res.data);
    } catch {}
  };

  const carregarCertificados = async () => {
    setCertLoading(true);
    try {
      const res = await certificadosAPI.meusCertificados();
      setCertificados(res.data || []);
    } catch {}
    setCertLoading(false);
  };

  const carregarProgresso = async () => {
    setProgressoLoading(true);
    try {
      // Busca IDs dos cursos concluídos
      const resProgresso = await progressoAPI.meusConcluidos();
      const concluidos = resProgresso.data || [];

      // Busca detalhes de todos os cursos para cruzar
      const resCursos = await cursosAPI.listarTodos();
      const todosCursos = resCursos.data || [];

      const cursosComProgresso = concluidos.map(p => {
        const curso = todosCursos.find(c => c.id === p.cursoId);
        return {
          ...p,
          tituloCurso: curso?.titulo || `Curso #${p.cursoId}`,
          categoriaCurso: curso?.categoria || '',
          duracaoCurso: curso?.duracao || 0,
        };
      });

      setCursosProgresso(cursosComProgresso);
    } catch {}
    setProgressoLoading(false);
  };

  const statusLabel = {
    pendente: { texto: 'Solicitação enviada — aguardando análise do admin', cor: '#fbbf24' },
    aprovada: { texto: 'Solicitação aprovada!', cor: '#34d399' },
    recusada: { texto: 'Solicitação recusada. Você pode tentar novamente.', cor: '#ef4444' },
  };

  const podeSolicitar = usuario?.role === 'user' &&
    (!usuario?.statusSolicitacao || ['nenhuma', 'recusada'].includes(usuario.statusSolicitacao));

  const handleSolicitar = async (e) => {
    e.preventDefault();
    if (!justificativa.trim()) { setMensagem('Preencha a justificativa.'); return; }
    setLoading(true);
    setMensagem('');
    try {
      const response = await usuariosAPI.solicitarColaborador(usuario.id, justificativa);
      login({ ...usuario, statusSolicitacao: response.data.statusSolicitacao }, token);
      setMensagem('Solicitação enviada com sucesso!');
      setJustificativa('');
    } catch {
      setMensagem('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarPerfil = async () => {
    if (!nomeEdit.trim()) return;
    setLoading(true);
    try {
      const res = await usuarioDashboardAPI.atualizarPerfil(usuario.id, { nome: nomeEdit });
      login({ ...usuario, nome: res.data.nome }, token);
      setEditando(false);
      setMensagem('Perfil atualizado!');
    } catch {
      setMensagem('Erro ao atualizar perfil.');
    }
    setLoading(false);
  };

  const toggleVisibilidadeCert = async (id) => {
    try {
      const res = await certificadosAPI.alternarVisibilidade(id);
      setCertificados(prev => prev.map(c => c.id === id ? res.data : c));
    } catch {}
  };

  const formatDuration = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const status = statusLabel[usuario?.statusSolicitacao];
  const s = { card: { background: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333' } };

  const abas = [
    { key: 'perfil', label: 'Perfil' },
    { key: 'progresso', label: `Progresso${stats ? ` (${stats.concluidos})` : ''}` },
    { key: 'certificados', label: `Certificados (${certificados.length})` },
    { key: 'curriculo', label: 'Currículo' },
  ];

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header do perfil */}
        <div style={{ ...s.card, marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: stats ? '20px' : '0' }}>
            {usuario?.foto
              ? <img src={usuario.foto} alt={usuario.nome} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: '#000' }}>
                  {usuario?.nome?.charAt(0).toUpperCase()}
                </div>
            }
            <div style={{ flex: 1 }}>
              {editando ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    value={nomeEdit}
                    onChange={e => setNomeEdit(e.target.value)}
                    style={{ background: '#111', border: '1px solid #FFD700', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                  <button onClick={handleSalvarPerfil} disabled={loading} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer' }}>
                    Salvar
                  </button>
                  <button onClick={() => setEditando(false)} style={{ background: 'transparent', color: '#999', border: '1px solid #444', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ color: '#FFD700', margin: 0 }}>{usuario?.nome}</h2>
                  <button onClick={() => { setEditando(true); setNomeEdit(usuario?.nome || ''); }} style={{ background: 'transparent', border: '1px solid #444', borderRadius: '6px', padding: '4px 10px', color: '#999', cursor: 'pointer', fontSize: '0.8rem' }}>
                    Editar
                  </button>
                </div>
              )}
              <p style={{ color: '#999', margin: '4px 0 0' }}>{usuario?.email}</p>
              <span style={{ background: '#333', color: '#FFD700', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', marginTop: '6px', display: 'inline-block' }}>
                {usuario?.role === 'admin' ? 'Administrador' : usuario?.role === 'colaborador' ? 'Colaborador' : 'Usuário'}
              </span>
            </div>
          </div>

          {/* Stats rápidas — sempre visíveis */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Concluídos', value: stats.concluidos },
                { label: 'Certificados', value: stats.certificados },
                { label: 'Horas', value: `${Math.floor((stats.totalMinutos || 0) / 60)}h` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#111', borderRadius: '8px', padding: '12px', textAlign: 'center', border: '1px solid #333' }}>
                  <div style={{ color: '#FFD700', fontSize: '1.4rem', fontWeight: 700 }}>{value}</div>
                  <div style={{ color: '#999', fontSize: '0.8rem' }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {mensagem && (
            <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: '#111', border: `1px solid ${mensagem.includes('sucesso') || mensagem.includes('atualizado') ? '#34d399' : '#ef4444'}`, color: mensagem.includes('sucesso') || mensagem.includes('atualizado') ? '#34d399' : '#ef4444', fontSize: '0.875rem' }}>
              {mensagem}
            </div>
          )}
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#111', borderRadius: '10px', padding: '4px', border: '1px solid #333' }}>
          {abas.map(({ key, label }) => (
            <button key={key} onClick={() => setAba(key)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', background: aba === key ? '#FFD700' : 'transparent', color: aba === key ? '#000' : '#999', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ===== ABA PERFIL ===== */}
        {aba === 'perfil' && (
          <div style={s.card}>
            {usuario?.role === 'colaborador' && (
              <div style={{ background: '#0d2d1a', border: '1px solid #34d399', borderRadius: '8px', padding: '16px', color: '#34d399', marginBottom: '16px' }}>
                Você já é um colaborador e pode criar cursos na plataforma.
              </div>
            )}
            {usuario?.role === 'user' && (
              <div>
                <h3 style={{ color: '#fff', marginBottom: '8px' }}>Quero ser Colaborador</h3>
                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '16px' }}>
                  Colaboradores podem criar e submeter cursos para aprovação.
                </p>
                {status && (
                  <div style={{ background: '#111', border: `1px solid ${status.cor}`, borderRadius: '8px', padding: '12px', color: status.cor, marginBottom: '16px' }}>
                    {status.texto}
                  </div>
                )}
                {podeSolicitar && (
                  <form onSubmit={handleSolicitar}>
                    <textarea
                      value={justificativa}
                      onChange={(e) => setJustificativa(e.target.value)}
                      placeholder="Ex: Sou desenvolvedor há 3 anos e quero compartilhar meu conhecimento..."
                      rows={4}
                      maxLength={500}
                      style={{ width: '100%', background: '#111', border: '1px solid #444', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>{justificativa.length}/500</span>
                      <button type="submit" disabled={loading} style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Enviando...' : 'Enviar Solicitação'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== ABA PROGRESSO ===== */}
        {aba === 'progresso' && (
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#FFD700', margin: 0 }}>Meu Progresso</h3>
              <button onClick={carregarProgresso} style={{ background: 'transparent', border: '1px solid #444', borderRadius: '6px', padding: '6px 12px', color: '#999', cursor: 'pointer', fontSize: '0.8rem' }}>
                Atualizar
              </button>
            </div>

            {/* Barra geral */}
            {stats && (
              <div style={{ marginBottom: '24px', padding: '16px', background: '#111', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#ccc', fontSize: '0.875rem' }}>Progresso geral</span>
                  <span style={{ color: '#FFD700', fontWeight: 700, fontSize: '0.875rem' }}>
                    {stats.concluidos} de {stats.totalCursos} cursos
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: stats.totalCursos > 0 ? `${Math.min((stats.concluidos / stats.totalCursos) * 100, 100)}%` : '0%',
                    background: 'linear-gradient(90deg, #FFD700, #34d399)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <span style={{ color: '#34d399', fontSize: '0.8rem' }}>{stats.concluidos} concluídos</span>
                  <span style={{ color: '#999', fontSize: '0.8rem' }}>{Math.floor((stats.totalMinutos || 0) / 60)}h estudadas</span>
                </div>
              </div>
            )}

            {progressoLoading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>Carregando...</div>
            ) : cursosProgresso.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <svg viewBox="0 0 24 24" fill="#444" style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }}>
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
                <p style={{ color: '#999', marginBottom: '8px' }}>Nenhum curso concluído ainda.</p>
                <p style={{ color: '#666', fontSize: '0.875rem' }}>Acesse um curso e marque como concluído para ver seu progresso aqui.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cursosProgresso.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: '#111', borderRadius: '10px', border: '1px solid #2a2a2a' }}>
                    {/* Ícone de check */}
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(52,211,153,0.15)', border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" fill="#34d399" style={{ width: 18, height: 18 }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.tituloCurso}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {p.categoriaCurso && (
                          <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', padding: '1px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600 }}>
                            {p.categoriaCurso}
                          </span>
                        )}
                        {p.duracaoCurso > 0 && (
                          <span style={{ color: '#666', fontSize: '0.75rem' }}>{formatDuration(p.duracaoCurso)}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>Concluído</div>
                      {p.dataConclusao && (
                        <div style={{ color: '#555', fontSize: '0.7rem' }}>
                          {new Date(p.dataConclusao).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ABA CERTIFICADOS ===== */}
        {aba === 'certificados' && (
          <div style={s.card}>
            <h3 style={{ color: '#FFD700', marginBottom: '16px' }}>Meus Certificados</h3>
            {certLoading ? (
              <p style={{ color: '#999', textAlign: 'center' }}>Carregando...</p>
            ) : certificados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <svg viewBox="0 0 24 24" fill="#444" style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }}>
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <p style={{ color: '#999' }}>Nenhum certificado ainda.</p>
                <p style={{ color: '#666', fontSize: '0.875rem' }}>Conclua cursos e emita seus certificados na página do curso.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certificados.map(cert => (
                  <div key={cert.id} style={{ padding: '16px', background: '#111', borderRadius: '10px', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" fill="#000" style={{ width: 24, height: 24 }}>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 700, marginBottom: '4px' }}>{cert.tituloCurso}</div>
                      <div style={{ color: '#999', fontSize: '0.8rem' }}>
                        Emitido em {new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}
                      </div>
                      {cert.urlCertificado && (
                        <a href={cert.urlCertificado} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', fontSize: '0.8rem', textDecoration: 'none' }}>
                          Ver certificado
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => toggleVisibilidadeCert(cert.id)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${cert.publico ? '#34d399' : '#555'}`, background: 'transparent', color: cert.publico ? '#34d399' : '#999', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {cert.publico ? 'Público' : 'Privado'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ABA CURRÍCULO ===== */}
        {aba === 'curriculo' && (
          <div style={s.card}>
            <h3 style={{ color: '#FFD700', marginBottom: '16px' }}>Meu Currículo</h3>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '20px' }}>
              Gerado automaticamente com base nos cursos concluídos e certificados obtidos.
            </p>
            <div style={{ background: '#111', borderRadius: '10px', padding: '20px', border: '1px solid #333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 4px' }}>{usuario?.nome}</h4>
                  <p style={{ color: '#999', margin: 0, fontSize: '0.875rem' }}>{usuario?.email}</p>
                </div>
                <span style={{ background: '#333', color: '#FFD700', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {usuario?.role === 'colaborador' ? 'Colaborador' : 'Estudante'}
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '16px 0' }} />

              <h5 style={{ color: '#FFD700', marginBottom: '12px' }}>Certificados Obtidos</h5>
              {certificados.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.875rem' }}>Nenhum certificado ainda.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {certificados.map(cert => (
                    <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
                      <svg viewBox="0 0 24 24" fill="#FFD700" style={{ width: 18, height: 18, flexShrink: 0 }}>
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                      </svg>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{cert.tituloCurso}</div>
                        <div style={{ color: '#666', fontSize: '0.75rem' }}>
                          {new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: cert.publico ? '#34d399' : '#666', background: cert.publico ? 'rgba(52,211,153,0.1)' : '#222', padding: '2px 8px', borderRadius: '10px', border: `1px solid ${cert.publico ? '#34d399' : '#444'}` }}>
                        {cert.publico ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {stats && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '16px 0' }} />
                  <h5 style={{ color: '#FFD700', marginBottom: '12px' }}>Estatísticas</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <div style={{ padding: '10px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ color: '#FFD700', fontWeight: 700 }}>{stats.concluidos}</div>
                      <div style={{ color: '#999', fontSize: '0.8rem' }}>Cursos Concluídos</div>
                    </div>
                    <div style={{ padding: '10px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ color: '#FFD700', fontWeight: 700 }}>{Math.floor((stats.totalMinutos || 0) / 60)}h</div>
                      <div style={{ color: '#999', fontSize: '0.8rem' }}>Horas de Estudo</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
