import React, { useState, useEffect } from "react";
import {
  User, Briefcase, GraduationCap, Code, FolderGit2,
  Layout, Palette, Printer, Plus, Trash2,
  Mail, Phone, MapPin, Linkedin, Github, Globe,
  ArrowUp, ArrowDown, Upload, X, Check,
  Download, Sparkles, FileJson, Activity, Eye, Edit3
} from "lucide-react";

// !!! IMPORT THESE NEW LIBRARIES !!!
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* =========================================
   1. RESUME TEMPLATE
   ========================================= */

const NotionTemplate = ({ data, config }) => (
  <div className="h-full w-full bg-white text-slate-900 p-12 mt-4" style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont", fontSize: `${config.fontSize}px`, lineHeight: config.lineSpacing }}>
    {/* Header */}
    <div className="mb-8">
      {data.personalInfo.photo && (
        <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 object-cover rounded-lg mb-6 shadow-sm grayscale hover:grayscale-0 transition-all" />
      )}
      <h1 className="text-5xl font-bold tracking-tight mb-2">{data.personalInfo.fullName}</h1>
      <p className="text-xl text-slate-500 font-medium flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        {data.personalInfo.title}
      </p>
    </div>

    {/* Contact Info */}
    <div className="bg-slate-50 border border-slate-200 rounded-md p-4 mb-8 text-sm flex flex-wrap gap-4 text-slate-600 font-mono">
      {data.personalInfo.email && <span className="flex items-center gap-1">✉️ {data.personalInfo.email}</span>}
      {data.personalInfo.phone && <span className="flex items-center gap-1">📞 {data.personalInfo.phone}</span>}
      {data.personalInfo.location && <span className="flex items-center gap-1">📍 {data.personalInfo.location}</span>}
      {data.socials.linkedin && <span className="flex items-center gap-1">🔗 {data.socials.linkedin}</span>}
      {data.socials.github && <span className="flex items-center gap-1">💻 {data.socials.github}</span>}
    </div>

    <div className="space-y-8">
      {/* Summary */}
      <div className="border-l-4 border-slate-900 pl-4 py-1">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-2">About</h3>
        <p className="text-slate-700 leading-relaxed">{data.summary}</p>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Experience</h3>
        <div className="space-y-6">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg">
                  {exp.role} <span className="text-slate-400 font-normal">@ {exp.company}</span>
                </h4>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">{exp.duration}</span>
              </div>
              <p className="text-slate-600 mt-2 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Projects</h3>
          <div className="space-y-6">
            {data.projects.map((project, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg">{project.title}</h4>
                </div>
                <p className="text-slate-600 mt-2 whitespace-pre-line">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ModernTemplate = ({ data, design, config }) => (
  <div className="h-full w-full bg-white text-slate-800" style={{ fontFamily: design.font, fontSize: `${config.fontSize}px`, lineHeight: config.lineSpacing }}>
    <div className="p-8 text-white flex gap-6 items-center" style={{ backgroundColor: design.accentColor }}>
      {data.personalInfo.photo && (
        <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-sm" />
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-4xl font-bold tracking-tight truncate">{data.personalInfo.fullName}</h1>
        <p className="text-lg opacity-90 mt-1 font-medium">{data.personalInfo.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs opacity-90">
          {data.personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} /> {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} /> {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personalInfo.location}</span>}
          {data.socials.linkedin && <span className="flex items-center gap-1"><Linkedin size={12} /> {data.socials.linkedin}</span>}
          {data.socials.github && <span className="flex items-center gap-1"><Github size={12} /> {data.socials.github}</span>}
        </div>
      </div>
    </div>

    <div className="flex h-full">
      {/* Left Column */}
      <div className="w-1/3 bg-slate-50 p-6 border-r border-slate-100 space-y-6">
        <Section title="Skills" color={design.accentColor}>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-white border border-slate-200 px-2 py-1 text-[10px] rounded shadow-sm font-semibold text-slate-700">{skill}</span>
            ))}
          </div>
        </Section>
        <Section title="Education" color={design.accentColor}>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <p className="font-bold text-sm text-slate-800">{edu.degree}</p>
              <p className="text-xs text-slate-500 font-medium">{edu.school}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{edu.duration}</p>
            </div>
          ))}
        </Section>
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-6 space-y-6">
        {data.summary && <Section title="Professional Summary" color={design.accentColor}><p className="text-sm text-slate-600 text-justify">{data.summary}</p></Section>}

        <Section title="Experience" color={design.accentColor}>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4 relative pl-4 border-l-2 border-slate-200 last:mb-0">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: design.accentColor }} />
              <div className="flex justify-between items-baseline mb-0.5"><h4 className="font-bold text-sm text-slate-800">{exp.role}</h4><span className="text-[10px] text-slate-400 font-mono whitespace-nowrap ml-2">{exp.duration}</span></div>
              <p className="text-xs font-bold text-slate-500 mb-1.5">{exp.company}</p>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </Section>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <Section title="Projects" color={design.accentColor}>
            {data.projects.map((project, i) => (
              <div key={i} className="mb-4 relative pl-4 border-l-2 border-slate-200 last:mb-0">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: design.accentColor }} />
                <h4 className="font-bold text-sm text-slate-800 mb-0.5">{project.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{project.description}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  </div>
);

const Section = ({ title, children, color }) => (
  <div className="mb-2">
    <h3 className="uppercase text-xs font-bold mb-3 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-1" style={{ color }}>{title}</h3>
    {children}
  </div>
);

const ResumeScore = ({ data }) => {
  const [score, setScore] = useState(0);
  useEffect(() => {
    let calc = 0;
    if (data.personalInfo.fullName) calc += 10;
    if (data.personalInfo.email) calc += 10;
    if (data.personalInfo.title) calc += 10;
    if (data.summary.length > 50) calc += 15;
    if (data.experience.length >= 1) calc += 20;
    if (data.education.length >= 1) calc += 10;
    if (data.skills.length >= 3) calc += 15;
    if (data.personalInfo.photo) calc += 10;
    setScore(Math.min(calc, 100));
  }, [data]);

  const getColor = () => score < 50 ? "text-red-500" : score < 80 ? "text-yellow-500" : "text-green-500";

  return (
    <div className="mb-6 p-4 bg-slate-900 rounded-xl flex items-center gap-4 shadow-lg text-white">
      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-700" />
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className={getColor()} strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * score) / 100} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        </svg>
        <span className="absolute text-[10px] font-bold">{score}</span>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase text-slate-400">Score</h4>
        <p className="text-[10px] text-slate-500 mt-1">{score < 100 ? "Add details" : "Ready!"}</p>
      </div>
    </div>
  );
};

/* =========================================
   3. MAIN APP
   ========================================= */

const ResumeBuilder = () => {
  const [mobileView, setMobileView] = useState("editor");
  const [activeSection, setActiveSection] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false); // State for loading button

  const [design, setDesign] = useState({ template: "notion", accentColor: "#2563eb", font: "sans-serif" });
  const [config, setConfig] = useState({ fontSize: 14, lineSpacing: 1.5 });

  const [data, setData] = useState({
    personalInfo: { fullName: "Jane Doe", title: "Product Designer", email: "jane@example.com", phone: "+1 234 567 890", location: "New York, NY", photo: null },
    socials: { linkedin: "", github: "", website: "" },
    summary: "Creative and detail-oriented Product Designer with 5+ years of experience in building user-centric digital products.",
    skills: ["Figma", "User Research", "Prototyping", "HTML/CSS", "React Basic"],
    experience: [
      { id: 1, role: "Senior Designer", company: "TechFlow", duration: "2022 - Present", description: "Led the redesign of the core product dashboard, improving user retention by 15%." },
      { id: 2, role: "UI Designer", company: "CreativeStudio", duration: "2019 - 2022", description: "Designed web and mobile interfaces for fintech clients." }
    ],
    education: [{ id: 1, school: "Parsons School of Design", degree: "B.A. Interaction Design", duration: "2015 - 2019" }],
    projects: [{ id: 1, title: "E-Commerce App", description: "A mobile application for local artisans." }]
  });

  // --- NEW: PDF DOWNLOAD FUNCTION ---
  const handleDownloadPdf = async () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    setIsGenerating(true);

    try {
      // 1. Render the HTML to a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 2x scale for better resolution (Retina quality)
        useCORS: true, // Needed if you have images from other domains
        logging: false,
        backgroundColor: "#ffffff" // Ensure background is white
      });

      // 2. Convert canvas to image
      const imgData = canvas.toDataURL("image/png");

      // 3. Create PDF (A4 Size)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 4. Add Image to PDF and Save
      // imgData, format, x, y, width, height
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateData("personalInfo", "photo", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadJson = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "resume-data.json";
    link.click();
  };

  const updateData = (section, field, value) => setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  const updateList = (section, index, field, value) => { const list = [...data[section]]; list[index][field] = value; setData(prev => ({ ...prev, [section]: list })); };
  const addListItem = (section, item) => setData(prev => ({ ...prev, [section]: [...prev[section], item] }));
  const removeListItem = (section, index) => setData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  const moveItem = (section, index, direction) => {
    const items = [...data[section]];
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === items.length - 1) return;
    const temp = items[index]; items[index] = items[index + direction]; items[index + direction] = temp;
    setData(prev => ({ ...prev, [section]: items }));
  };

  const navItems = [
    { id: "personal", icon: User, label: "Personal" },
    { id: "socials", icon: Globe, label: "Links" },
    { id: "summary", icon: Layout, label: "Summary" },
    { id: "experience", icon: Briefcase, label: "Experience" },
    { id: "projects", icon: FolderGit2, label: "Projects" },
    { id: "education", icon: GraduationCap, label: "Education" },
    { id: "skills", icon: Code, label: "Skills" },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden mt-16">

      {/* 1. SIDEBAR */}
      <aside className="fixed bottom-0 left-0 w-full bg-slate-900 lg:static lg:w-20 lg:h-full flex lg:flex-col items-center justify-around lg:justify-start lg:py-6 z-50 lg:z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="hidden lg:block mb-8 p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <Activity className="text-white" size={24} />
        </div>

        <nav className="flex lg:flex-col w-full justify-around lg:justify-start lg:space-y-6 lg:px-3">
          <SidebarBtn
            icon={Edit3}
            label="Editor"
            active={mobileView === 'editor'}
            onClick={() => setMobileView("editor")}
          />
          <SidebarBtn
            icon={Palette}
            label="Design"
            active={mobileView === 'design'}
            onClick={() => setMobileView("design")}
          />
          <SidebarBtn
            icon={Eye}
            label="Preview"
            active={mobileView === 'preview'}
            onClick={() => setMobileView("preview")}
            className="lg:hidden"
          />
          <div className="hidden lg:block w-full h-px bg-slate-700 my-4"></div>
          <SidebarBtn icon={FileJson} label="Export" active={false} onClick={downloadJson} className="hidden lg:flex" />
        </nav>

        {/* --- REPLACED PRINT BUTTON WITH PDF BUTTON --- */}
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="hidden lg:block mt-auto mb-4 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download PDF"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={22} />}
        </button>
      </aside>

      {/* 2. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] lg:h-full relative overflow-hidden">

        {/* EDITOR PANEL */}
        <div className={`w-full lg:w-[450px] bg-white border-r border-slate-100 flex flex-col z-10 shadow-xl transition-transform duration-300 absolute inset-0 lg:static ${mobileView === 'preview' ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/90 sticky top-0 z-20">
            <h2 className="text-lg font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
              {mobileView === 'content' || mobileView === 'editor' ? activeSection : 'Design Studio'}
              {mobileView === 'design' && <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />}
            </h2>
            <button className="lg:hidden text-indigo-600 font-bold text-xs" onClick={downloadJson}>Save JSON</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-hide bg-slate-50/50 pb-20 lg:pb-6">
            {(mobileView === 'editor' || mobileView === 'content') ? (
              <>
                <ResumeScore data={data} />

                <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide snap-x">
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all snap-start ${activeSection === item.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                      <item.icon size={14} /> {item.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                  {activeSection === "personal" && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                        {data.personalInfo.photo ? (
                          <div className="relative group shrink-0">
                            <img src={data.personalInfo.photo} className="w-16 h-16 rounded-full object-cover" />
                            <button onClick={() => updateData("personalInfo", "photo", null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                          </div>
                        ) : <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><User size={24} /></div>}
                        <label className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all inline-flex items-center gap-2 w-full justify-center">
                          <Upload size={14} /> Upload Photo <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                      </div>
                      <Input label="Full Name" value={data.personalInfo.fullName} onChange={e => updateData("personalInfo", "fullName", e.target.value)} />
                      <Input label="Job Title" value={data.personalInfo.title} onChange={e => updateData("personalInfo", "title", e.target.value)} />
                      <Input label="Email" value={data.personalInfo.email} onChange={e => updateData("personalInfo", "email", e.target.value)} />
                      <Input label="Phone" value={data.personalInfo.phone} onChange={e => updateData("personalInfo", "phone", e.target.value)} />
                      <Input label="Location" value={data.personalInfo.location} onChange={e => updateData("personalInfo", "location", e.target.value)} />
                    </div>
                  )}

                  {activeSection === "socials" && (
                    <div className="space-y-4">
                      <Input label="LinkedIn" icon={Linkedin} value={data.socials.linkedin} onChange={e => updateData("socials", "linkedin", e.target.value)} />
                      <Input label="GitHub" icon={Github} value={data.socials.github} onChange={e => updateData("socials", "github", e.target.value)} />
                    </div>
                  )}

                  {activeSection === "summary" && <TextArea label="Summary" value={data.summary} onChange={e => setData({ ...data, summary: e.target.value })} rows={8} />}

                  {(activeSection === "experience" || activeSection === "projects" || activeSection === "education") && (
                    <div className="space-y-4">
                      {data[activeSection].map((item, i) => (
                        <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-indigo-500 transition-all group">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-[10px] font-bold uppercase text-slate-400">Item {i + 1}</h4>
                            <div className="flex gap-1">
                              <button onClick={() => moveItem(activeSection, i, -1)} className="p-1 hover:bg-slate-100 rounded" disabled={i === 0}><ArrowUp size={14} /></button>
                              <button onClick={() => moveItem(activeSection, i, 1)} className="p-1 hover:bg-slate-100 rounded" disabled={i === data[activeSection].length - 1}><ArrowDown size={14} /></button>
                              <button onClick={() => removeListItem(activeSection, i)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Input placeholder="Title / Role" value={item.title || item.role || item.school} onChange={e => updateList(activeSection, i, item.title !== undefined ? 'title' : (item.role !== undefined ? 'role' : 'school'), e.target.value)} />
                            <Input placeholder="Company / Degree" value={item.company || item.degree || item.description} onChange={e => updateList(activeSection, i, item.company !== undefined ? 'company' : (item.degree !== undefined ? 'degree' : 'description'), e.target.value)} />
                            {activeSection !== "projects" && <Input placeholder="Duration" value={item.duration} onChange={e => updateList(activeSection, i, 'duration', e.target.value)} />}
                            {activeSection !== "projects" && <TextArea placeholder="Description" value={item.description} onChange={e => updateList(activeSection, i, 'description', e.target.value)} />}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addListItem(activeSection, {})} className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex justify-center gap-2"><Plus size={18} /> Add Item</button>
                    </div>
                  )}

                  {activeSection === "skills" && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {data.skills.map((skill, i) => <span key={i} className="bg-slate-100 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-2">{skill} <button onClick={() => removeListItem('skills', i)}><X size={12} /></button></span>)}
                      </div>
                      <form onSubmit={e => { e.preventDefault(); const val = e.target.elements.skill.value.trim(); if (val) { addListItem('skills', val); e.target.reset(); } }} className="flex gap-2">
                        <input name="skill" className="flex-1 form-input" placeholder="Add skill..." />
                        <button className="bg-indigo-600 text-white px-4 rounded-lg text-sm font-bold">Add</button>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  {['notion', 'modern'].map(t => (
                    <button key={t} onClick={() => setDesign({ ...design, template: t })} className={`p-4 border-2 rounded-xl text-sm capitalize font-bold transition-all flex flex-col items-center gap-2 ${design.template === t ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <div className={`w-full h-16 rounded bg-slate-100 mb-2 border border-slate-200 ${t === 'notion' ? 'font-mono text-[8px] p-1' : ''}`}>{t}</div>
                      {t} Style
                    </button>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Accent Color</label>
                  <div className="flex flex-wrap gap-3">
                    {['#2563eb', '#000000', '#16a34a', '#9333ea', '#ea580c'].map(c => (
                      <button key={c} onClick={() => setDesign({ ...design, accentColor: c })} className={`w-8 h-8 rounded-full ${design.accentColor === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between"><span>Font Size</span> <span>{config.fontSize}px</span></label>
                    <input type="range" min="12" max="18" step="0.5" value={config.fontSize} onChange={(e) => setConfig({ ...config, fontSize: e.target.value })} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between"><span>Spacing</span> <span>{config.lineSpacing}x</span></label>
                    <input type="range" min="1" max="2" step="0.1" value={config.lineSpacing} onChange={(e) => setConfig({ ...config, lineSpacing: e.target.value })} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <main className={`
          flex-1 bg-slate-200/50 overflow-auto flex justify-center items-start p-4 lg:p-12 absolute inset-0 lg:static z-30 transition-transform duration-300 bg-white
          ${mobileView === 'preview' ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          print:p-0 print:bg-white print:overflow-visible print:translate-x-0
        `}>
          <div className="scale-[0.4] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.80] origin-top shadow-2xl transition-transform duration-300 print:scale-100 print:shadow-none mt-4 lg:mt-0">
            <div id="resume-preview" className="w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden print:w-screen print:min-h-screen print:shadow-none print:m-0">
              {design.template === 'modern' ? <ModernTemplate data={data} design={design} config={config} /> : <NotionTemplate data={data} config={config} />}
            </div>
          </div>
          {/* <div className="absolute bottom-8 lg:bottom-8 bg-slate-900/90 backdrop-blur px-6 py-2 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-2 print:hidden">
            <Layout size={14} className="text-indigo-400" /> Live A4 Preview
          </div> */}
          {/* Mobile Back Button */}
          <button onClick={() => setMobileView('editor')} className="lg:hidden absolute top-4 left-4 bg-slate-900 text-white p-2 rounded-full shadow-lg z-50">
            <ArrowUp className="-rotate-90" size={20} />
          </button>

          {/* Mobile Download Button */}
          <button onClick={handleDownloadPdf} className="lg:hidden absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50">
            {isGenerating ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={20} />}
          </button>
        </main>
      </div>

      <style>{`
        .form-input { width: 100%; padding: 0.6rem 0.8rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; font-size: 0.875rem; outline: none; transition: all 0.2s; background: #fff; }
        .form-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @media print { 
          aside, .w-\\[450px\\], .absolute { display: none !important; } 
          .h-screen { height: auto !important; overflow: visible !important; }
          main { position: relative !important; transform: none !important; width: 100% !important; height: auto !important; padding: 0 !important; background: white !important; display: block !important; } 
          #resume-preview { width: 100% !important; height: auto !important; box-shadow: none !important; margin: 0 !important; transform: none !important; } 
          .scale-\\[0.4\\] { transform: scale(1) !important; }
        }
      `}</style>
    </div>
  );
};

const SidebarBtn = ({ icon: Icon, label, active, onClick, className = "" }) => (
  <button onClick={onClick} className={`flex lg:flex-col items-center justify-center p-2 rounded-xl transition-all ${active ? 'text-indigo-400 bg-slate-800' : 'text-slate-500 hover:text-white hover:bg-slate-800'} ${className}`}>
    <Icon size={20} /> <span className="text-[10px] ml-2 lg:ml-0 lg:mt-1.5 font-bold tracking-wide">{label}</span>
  </button>
);
const Input = (props) => <div className="space-y-1">{props.label && <label className="text-[11px] font-bold text-slate-400 uppercase">{props.label}</label>}<input className="form-input" {...props} /></div>;
const TextArea = (props) => <div className="space-y-1">{props.label && <label className="text-[11px] font-bold text-slate-400 uppercase">{props.label}</label>}<textarea className="form-input min-h-[100px] resize-y" {...props} /></div>;

export default ResumeBuilder;