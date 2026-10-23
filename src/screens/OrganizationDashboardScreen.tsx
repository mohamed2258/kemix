import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BarChart3, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Lock, 
  BookOpen, 
  Award, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { OrganizationStudent, OrganizationGroup } from '../types';

export const OrganizationDashboardScreen: React.FC = () => {
  const { db, addOrgStudent, removeOrgStudent, createOrgGroup, assignTrackToGroup, navigateTo } = useGame();
  const org = db.organizationAccount;
  const worlds = db.curriculum.worlds;

  const [activeTab, setActiveTab] = useState<'students' | 'groups' | 'reports'>('students');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');

  // New Student modal / form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGroupId, setNewStudentGroupId] = useState(org?.groups[0]?.id || '');
  const [studentFormMsg, setStudentFormMsg] = useState<string | null>(null);

  // New Group modal / form
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newInstructorName, setNewInstructorName] = useState('');
  const [newAssignedWorldId, setNewAssignedWorldId] = useState(worlds[0]?.id || 'world_logic');

  if (!org) {
    return (
      <div style={{ flex: 1, padding: '32px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.4rem' }}>لا توجد بيانات مؤسسة مفعلة حالياً.</h2>
        <button onClick={() => navigateTo('subscription')} className="btn-primary" style={{ marginTop: '16px' }}>
          عرض خطة المؤسسات
        </button>
      </div>
    );
  }

  const filteredStudents = selectedGroupId === 'all'
    ? org.students
    : org.students.filter(s => s.groupId === selectedGroupId);

  const totalXP = org.students.reduce((acc, s) => acc + s.xp, 0);
  const avgCompletion = org.students.length > 0 
    ? Math.round(org.students.reduce((acc, s) => acc + s.completionRatePercent, 0) / org.students.length) 
    : 0;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const res = addOrgStudent(newStudentName.trim(), newStudentEmail.trim(), newStudentGroupId);
    if (res.success) {
      setNewStudentName('');
      setNewStudentEmail('');
      setShowAddStudentModal(false);
    } else {
      setStudentFormMsg(res.message);
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newInstructorName.trim()) return;

    createOrgGroup(newGroupName.trim(), newInstructorName.trim(), newAssignedWorldId);
    setNewGroupName('');
    setNewInstructorName('');
    setShowAddGroupModal(false);
  };

  const exportReport = () => {
    const reportData = {
      orgName: org.orgName,
      exportedAt: new Date().toISOString(),
      seatsPurchased: org.seatsTotal,
      seatsUsed: org.seatsUsed,
      avgCompletionRate: avgCompletion,
      totalXP,
      students: org.students.map(s => ({
        name: s.name,
        email: s.email,
        level: s.level,
        xp: s.xp,
        completionRate: s.completionRatePercent + '%',
        strengths: s.strengths.join(', '),
        weaknesses: s.weaknesses.join(', ') || 'لا توجد ملاحظات'
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KEMIX_Report_${org.orgName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div 
        className="game-card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(11, 19, 41, 0.95))',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: 'rgba(168, 85, 247, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc'
          }}>
            <Building2 size={36} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)' }}>
                {org.orgName}
              </h1>
              <span style={{
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: '1px solid rgba(168, 85, 247, 0.4)'
              }}>
                لوحة تحكم المؤسسات (Organization Dashboard)
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              المسؤول: {org.contactPerson} • {org.email}
            </p>
          </div>
        </div>

        {/* Seats Pill & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            padding: '8px 16px',
            borderRadius: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>المقاعد المستهلكة</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#c084fc' }}>
              {org.students.length} / {org.seatsTotal}
            </div>
          </div>

          <button
            onClick={exportReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              color: '#00e5ff',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            <span>تصدير تقرير الإنجاز</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={28} color="#00e5ff" />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-main)' }}>
              {org.students.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>إجمالي الطلاب المسجلين</div>
          </div>
        </div>

        <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GraduationCap size={28} color="#a855f7" />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-main)' }}>
              {org.groups.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>الفصول والمجموعات الدراسية</div>
          </div>
        </div>

        <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={28} color="#10b981" />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-main)' }}>
              %{avgCompletion}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>متوسط إكمال المناهج</div>
          </div>
        </div>

        <div className="game-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={28} color="#fbbf24" />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-main)' }}>
              {totalXP.toLocaleString('ar-EG')}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>مجموع نقاط XP للطلاب</div>
          </div>
        </div>
      </div>

      {/* Privacy Notice Pill */}
      <div style={{
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '10px 16px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <ShieldCheck size={18} color="#10b981" />
        <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
          نظام حماية خصوصية الطلاب مفعل: لا يستطيع أي طالب الاطلاع على بيانات أو أداء زملائه؛ البيانات متاحة فقط لمشرفي ومدرسي المؤسسة.
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
        {[
          { id: 'students', label: 'قائمة الطلاب والتقدم', icon: <Users size={16} /> },
          { id: 'groups', label: 'الفصول والمدرسين', icon: <GraduationCap size={16} /> },
          { id: 'reports', label: 'تقارير ونقاط القوة والضعف', icon: <FileText size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #a855f7' : '3px solid transparent',
              color: activeTab === tab.id ? '#c084fc' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 800 : 600,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Students Roster */}
      {activeTab === 'students' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>تصفية حسب الفصل:</span>
              <select
                value={selectedGroupId}
                onChange={e => setSelectedGroupId(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              >
                <option value="all">كافة الفصول والمجموعات</option>
                {org.groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                borderRadius: '10px'
              }}
            >
              <PlusCircle size={18} />
              <span>إضافة طالب جديد</span>
            </button>
          </div>

          {/* Students Table */}
          <div className="game-card" style={{ padding: '0', overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الطالب</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الفصل</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>المستوى</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>XP</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>نسبة الإنجاز</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>نقاط القوة</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const grp = org.groups.find(g => g.id === student.groupId);
                  return (
                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{student.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{student.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {grp?.name || 'غير محدد'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          backgroundColor: 'rgba(0, 229, 255, 0.12)',
                          color: '#00e5ff',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontWeight: 800
                        }}>
                          المستوى {student.level}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#fbbf24' }}>
                        {student.xp} XP
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${student.completionRatePercent}%`, height: '100%', backgroundColor: '#10b981' }} />
                          </div>
                          <span style={{ fontWeight: 700, color: '#10b981' }}>%{student.completionRatePercent}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {student.strengths.slice(0, 2).join('، ') || 'مبتدئ'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => removeOrgStudent(student.id)}
                          title="حذف الطالب"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Classrooms & Instructors */}
      {activeTab === 'groups' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => setShowAddGroupModal(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem', borderRadius: '10px' }}
            >
              <PlusCircle size={18} />
              <span>إنشاء فصل / مجموعة جديدة</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {org.groups.map(grp => {
              const assignedWorld = worlds.find(w => w.id === grp.assignedWorldId) || worlds[0];
              const groupStudents = org.students.filter(s => s.groupId === grp.id);

              return (
                <div key={grp.id} className="game-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        {grp.name}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        المدرس المشرف: {grp.instructorName}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      color: '#c084fc',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: 800
                    }}>
                      {groupStudents.length} طلاب
                    </span>
                  </div>

                  {/* Assigned Path Selector */}
                  <div style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.06)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '14px'
                  }}>
                    <label style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                      المسار البرمجي المخصص لهذا الفصل:
                    </label>
                    <select
                      value={grp.assignedWorldId || worlds[0]?.id}
                      onChange={e => assignTrackToGroup(grp.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    >
                      {worlds.map(w => (
                        <option key={w.id} value={w.id}>{w.icon} {w.titleAr} ({w.titleEn})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    تم إنشاء الفصل بتاريخ: {new Date(grp.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Reports & Performance Analytics */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="game-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '14px' }}>
              تحليل نقاط القوة والضعف للمجموعات الدراسية
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={18} />
                  <span>المفاهيم الأكثر تميزاً بين الطلاب:</span>
                </div>
                <ul style={{ paddingRight: '20px', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  <li>المتغيرات وأنواع البيانات (نسبة الإتقان 94%)</li>
                  <li>الشروط المنطقية if/else (نسبة الإتقان 88%)</li>
                  <li>طباعة المخرجات واستقبال المدخلات (نسبة الإتقان 96%)</li>
                </ul>
              </div>

              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '14px' }}>
                <div style={{ fontWeight: 800, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={18} />
                  <span>المفاهيم التي تحتاج لدعم ومراجعة إضافية:</span>
                </div>
                <ul style={{ paddingRight: '20px', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  <li>الحلقات المتداخلة (Nested Loops) - نسبة الخطأ 38%</li>
                  <li>تتبع الأخطاء البرمجية (Debugging) - يوصى بجولة بنك الأخطاء</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(10px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="game-card animate-scale-up" style={{ maxWidth: '440px', width: '100%', backgroundColor: '#0b1329', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '14px', color: 'var(--text-main)' }}>
              إضافة طالب جديد للمؤسسة
            </h3>

            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>اسم الطالب:</label>
                <input
                  type="text"
                  required
                  placeholder="الاسم الكامل"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>البريد الإلكتروني للطالب:</label>
                <input
                  type="email"
                  required
                  placeholder="student@school.edu.eg"
                  value={newStudentEmail}
                  onChange={e => setNewStudentEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>الفصل الدراسي:</label>
                <select
                  value={newStudentGroupId}
                  onChange={e => setNewStudentGroupId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                >
                  {org.groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              {studentFormMsg && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem' }}>{studentFormMsg}</div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>
                  حفظ وتسجيل الطالب
                </button>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showAddGroupModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(10px)', zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="game-card animate-scale-up" style={{ maxWidth: '440px', width: '100%', backgroundColor: '#0b1329', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '14px', color: 'var(--text-main)' }}>
              إنشاء فصل أو مجموعة دراسية جديدة
            </h3>

            <form onSubmit={handleAddGroup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>اسم الفصل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فصل علوم الحاسب - الصف الأول"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>اسم المدرس / المشرف:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أ. أحمد صلاح"
                  value={newInstructorName}
                  onChange={e => setNewInstructorName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>المسار البرمجي الافتراضي:</label>
                <select
                  value={newAssignedWorldId}
                  onChange={e => setNewAssignedWorldId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                >
                  {worlds.map(w => (
                    <option key={w.id} value={w.id}>{w.icon} {w.titleAr}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px' }}>
                  إنشاء الفصل
                </button>
                <button type="button" onClick={() => setShowAddGroupModal(false)} style={{ padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboardScreen;
