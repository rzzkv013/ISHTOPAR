"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  DollarSign,
  Filter,
  Globe2,
  LogOut,
  MapPin,
  Mail,
  Menu,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  created_at: string;
  user_id?: string;
};

type AppUser = {
  id: string;
  email: string;
};

type AuthMode = "login" | "signup";

const JOBS_STORAGE_KEY = "devjobs-uz-local-jobs";
const USER_STORAGE_KEY = "devjobs-uz-demo-user";
const APPLICATIONS_STORAGE_KEY = "devjobs-uz-applications";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const categories = [
  "Barchasi",
  "Frontend",
  "Backend",
  "Mobile",
  "Design",
  "DevOps",
  "Data",
];

const demoJobs: Job[] = [
  {
    id: "demo-1",
    title: "Senior Frontend Developer",
    company: "Uzum",
    location: "Toshkent · Gibrid",
    category: "Frontend",
    type: "To‘liq stavka",
    salary: "$3,000 – $4,500",
    description:
      "Millionlab foydalanuvchilar foydalanadigan mahsulotlar uchun tezkor va qulay web interfeyslar yarating.",
    tags: ["React", "Next.js", "TypeScript"],
    created_at: "2026-10-06T10:00:00.000Z",
  },
  {
    id: "demo-2",
    title: "Backend Engineer",
    company: "Click",
    location: "Toshkent · Ofis",
    category: "Backend",
    type: "To‘liq stavka",
    salary: "$2,500 – $4,000",
    description:
      "Yuqori yuklamali to‘lov xizmatlari uchun ishonchli API va mikroservislarni ishlab chiqing.",
    tags: ["Node.js", "PostgreSQL", "Redis"],
    created_at: "2026-10-05T10:00:00.000Z",
  },
  {
    id: "demo-3",
    title: "Product Designer",
    company: "TBC Bank",
    location: "Toshkent · Gibrid",
    category: "Design",
    type: "To‘liq stavka",
    salary: "$1,800 – $2,800",
    description:
      "Raqamli bank xizmatlari uchun sodda, tushunarli va yoqimli foydalanuvchi tajribasini loyihalang.",
    tags: ["Figma", "UI/UX", "Design system"],
    created_at: "2026-10-04T10:00:00.000Z",
  },
  {
    id: "demo-4",
    title: "React Native Developer",
    company: "Payme",
    location: "Toshkent · Masofaviy",
    category: "Mobile",
    type: "To‘liq stavka",
    salary: "$2,200 – $3,600",
    description:
      "iOS va Android uchun ommabop fintech ilovasining yangi imkoniyatlarini yarating.",
    tags: ["React Native", "TypeScript", "Expo"],
    created_at: "2026-10-03T10:00:00.000Z",
  },
  {
    id: "demo-5",
    title: "DevOps Engineer",
    company: "IT Park",
    location: "Toshkent · Gibrid",
    category: "DevOps",
    type: "To‘liq stavka",
    salary: "$2,000 – $3,500",
    description:
      "Bulutli infratuzilma, CI/CD jarayonlari va xizmatlar barqarorligini yaxshilang.",
    tags: ["AWS", "Docker", "Kubernetes"],
    created_at: "2026-10-02T10:00:00.000Z",
  },
  {
    id: "demo-6",
    title: "Data Analyst",
    company: "Solfy",
    location: "Toshkent · Masofaviy",
    category: "Data",
    type: "To‘liq stavka",
    salary: "$1,500 – $2,500",
    description:
      "Ma’lumotlardan biznes qarorlari uchun amaliy xulosalar chiqaring va analitik jarayonlarni rivojlantiring.",
    tags: ["Python", "SQL", "Tableau"],
    created_at: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "demo-7",
    title: "Full-stack Developer",
    company: "Napa Team",
    location: "Toshkent · Masofaviy",
    category: "Backend",
    type: "To‘liq stavka",
    salary: "$2,000 – $3,200",
    description:
      "Mahalliy va xalqaro mijozlar uchun mahsulotlarni jamoa bilan birga noldan ishga tushiring.",
    tags: ["Next.js", "Node.js", "MongoDB"],
    created_at: "2026-09-30T10:00:00.000Z",
  },
  {
    id: "demo-8",
    title: "Junior Frontend Developer",
    company: "AloqaBank",
    location: "Toshkent · Ofis",
    category: "Frontend",
    type: "To‘liq stavka",
    salary: "$800 – $1,400",
    description:
      "Tajribali dasturchilar bilan ishlang, zamonaviy web texnologiyalarni o‘rganing va o‘sing.",
    tags: ["JavaScript", "React", "CSS"],
    created_at: "2026-09-29T10:00:00.000Z",
  },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0c1020] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/15";

function readLocalJobs(): Job[] {
  try {
    const saved = window.localStorage.getItem(JOBS_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("Saqlangan vakansiyalar formati noto‘g‘ri.");
    }
    return parsed as Job[];
  } catch (error) {
    console.error("Mahalliy vakansiyalarni o‘qib bo‘lmadi:", error);
    return [];
  }
}

function saveLocalJobs(jobs: Job[]) {
  try {
    window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error("Vakansiyalarni brauzerda saqlab bo‘lmadi:", error);
    throw new Error("Vakansiyani brauzer xotirasiga saqlab bo‘lmadi.");
  }
}

function formatPostedDate(date: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000),
  );
  if (days === 0) return "Bugun";
  if (days === 1) return "Kecha";
  if (days < 7) return `${days} kun oldin`;
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!supabase);
  const [user, setUser] = useState<AppUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [postOpen, setPostOpen] = useState(false);
  const [applicationJob, setApplicationJob] = useState<Job | null>(null);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setIsLoading(true);
      try {
        const localJobs = readLocalJobs();
        let loadedJobs: Job[] = [];

        if (supabase) {
          const { data, error } = await supabase
            .from("jobs")
            .select("*")
            .order("created_at", { ascending: false });
          if (error) throw error;
          loadedJobs = (data ?? []) as Job[];
        }

        if (!active) return;
        setIsDemo(!supabase || loadedJobs.length === 0);
        const availableJobs =
          loadedJobs.length > 0
            ? [...localJobs, ...loadedJobs]
            : [...localJobs, ...demoJobs];
        const uniqueJobs = Array.from(
          new Map(availableJobs.map((job) => [job.id, job])).values(),
        ).sort(
          (first, second) =>
            new Date(second.created_at).getTime() -
            new Date(first.created_at).getTime(),
        );
        setJobs(uniqueJobs);
      } catch (error) {
        console.error("Supabase vakansiyalarini yuklab bo‘lmadi:", error);
        if (active) {
          setIsDemo(true);
          setJobs(
            [...readLocalJobs(), ...demoJobs].sort(
              (first, second) =>
                new Date(second.created_at).getTime() -
                new Date(first.created_at).getTime(),
            ),
          );
          setToast("Supabase bilan aloqa yo‘q. Demo vakansiyalar ko‘rsatildi.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    async function loadUser() {
      if (!supabase) {
        try {
          const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
          if (savedUser) setUser(JSON.parse(savedUser) as AppUser);
        } catch (error) {
          console.error("Demo foydalanuvchi ma’lumotini o‘qib bo‘lmadi:", error);
        }
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Foydalanuvchi sessiyasini olishda xatolik:", error);
        return;
      }
      if (active && session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      }
    }

    void loadJobs();
    void loadUser();

    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        setUser(
          session?.user
            ? { id: session.user.id, email: session.user.email ?? "" }
            : null,
        );
      });
      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    return jobs.filter((job) => {
      const matchesCategory =
        activeCategory === "Barchasi" || job.category === activeCategory;
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.category,
        ...job.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [jobs, searchQuery, activeCategory]);

  const companies = useMemo(() => {
    const grouped = new Map<string, Job[]>();
    for (const job of jobs) {
      grouped.set(job.company, [...(grouped.get(job.company) ?? []), job]);
    }
    return Array.from(grouped, ([name, companyJobs]) => ({
      name,
      jobs: companyJobs,
      openings: companyJobs.length,
      location: companyJobs[0].location.split("·")[0].trim(),
    })).sort((first, second) => first.name.localeCompare(second.name));
  }, [jobs]);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function showCompanyJobs(company: string) {
    setSearchQuery(company);
    setActiveCategory("Barchasi");
    scrollToSection("jobs");
  }

  async function handleApplicationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applicationJob) return;

    const formData = new FormData(event.currentTarget);
    const application = {
      job_id: applicationJob.id,
      job_title: applicationJob.title,
      company: applicationJob.company,
      applicant_name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      cover_letter: String(formData.get("message") ?? "").trim(),
      user_id: user?.id.startsWith("demo-") ? null : user?.id ?? null,
      created_at: new Date().toISOString(),
    };

    if (!application.applicant_name || !application.email || !application.phone) {
      setToast("Ism, email va telefon raqamini kiriting.");
      return;
    }

    if (supabase) {
      const { error } = await supabase.from("applications").insert(application);
      if (!error) {
        setApplicationJob(null);
        setToast("Arizangiz kompaniyaga muvaffaqiyatli yuborildi.");
        return;
      }
      console.error("Arizani Supabase bazasiga yuborib bo‘lmadi:", error);
    }

    try {
      const savedApplications = window.localStorage.getItem(
        APPLICATIONS_STORAGE_KEY,
      );
      const previousApplications: unknown = savedApplications
        ? JSON.parse(savedApplications)
        : [];
      if (!Array.isArray(previousApplications)) {
        throw new Error("Saqlangan arizalar formati noto‘g‘ri.");
      }
      window.localStorage.setItem(
        APPLICATIONS_STORAGE_KEY,
        JSON.stringify([application, ...previousApplications]),
      );
      setApplicationJob(null);
      setToast(
        supabase
          ? "Supabase arizani saqlamadi. Ariza ushbu brauzerda saqlandi."
          : "Arizangiz demo rejimida yuborildi va ushbu brauzerda saqlandi.",
      );
    } catch (error) {
      console.error("Arizani mahalliy xotirada saqlab bo‘lmadi:", error);
      setToast("Arizani yuborib bo‘lmadi. Qayta urinib ko‘ring.");
    }
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setToast("Email va parolni to‘ldiring.");
      return;
    }

    if (!supabase) {
      const demoUser = { id: `demo-${email}`, email };
      try {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        setAuthOpen(false);
        setToast("Demo hisobga muvaffaqiyatli kirdingiz.");
      } catch (error) {
        console.error("Demo hisobni saqlashda xatolik:", error);
        setToast("Demo hisobni saqlab bo‘lmadi. Brauzer xotirasini tekshiring.");
      }
      return;
    }

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email ?? email,
          });
          setAuthOpen(false);
          setToast("Hisobingiz muvaffaqiyatli yaratildi.");
        } else {
          setToast("Hisob yaratildi. Emailingizni tasdiqlab, tizimga kiring.");
          setAuthMode("login");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser({
          id: data.user.id,
          email: data.user.email ?? email,
        });
        setAuthOpen(false);
        setToast("Tizimga muvaffaqiyatli kirdingiz.");
      }
    } catch (error) {
      console.error("Supabase autentifikatsiyasida xatolik:", error);
      const demoUser = { id: `demo-${email}`, email };
      try {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        setAuthOpen(false);
        setIsDemo(true);
        setToast("Supabase Auth ishlamadi. Demo hisob bilan davom etyapsiz.");
      } catch (storageError) {
        console.error("Demo hisobni saqlashda xatolik:", storageError);
        setToast("Kirish amalga oshmadi. Supabase sozlamalarini tekshiring.");
      }
    }
  }

  async function handleSignOut() {
    if (supabase && !user?.id.startsWith("demo-")) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Tizimdan chiqishda xatolik:", error);
        setToast("Tizimdan chiqib bo‘lmadi. Qayta urinib ko‘ring.");
        return;
      }
    }
    try {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error("Demo sessiyani o‘chirishda xatolik:", error);
    }
    setUser(null);
    setToast("Hisobdan chiqdingiz.");
  }

  async function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setPostOpen(false);
      setAuthOpen(true);
      setToast("Vakansiya joylash uchun tizimga kiring.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const newJob: Job = {
      id: `local-${Date.now()}`,
      title: String(formData.get("title") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      category: String(formData.get("category") ?? "Frontend"),
      type: String(formData.get("type") ?? "To‘liq stavka"),
      salary: String(formData.get("salary") ?? "").trim() || "Kelishiladi",
      description: String(formData.get("description") ?? "").trim(),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      created_at: new Date().toISOString(),
      user_id: user.id,
    };

    if (
      !newJob.title ||
      !newJob.company ||
      !newJob.location ||
      !newJob.description
    ) {
      setToast("Majburiy maydonlarni to‘liq kiriting.");
      return;
    }

    if (supabase && !user.id.startsWith("demo-")) {
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          category: newJob.category,
          type: newJob.type,
          salary: newJob.salary,
          description: newJob.description,
          tags: newJob.tags,
          user_id: user.id,
        })
        .select()
        .single();

      if (!error && data) {
        const insertedJob = data as Job;
        setJobs((current) => [insertedJob, ...current]);
        setPostOpen(false);
        setToast("Vakansiyangiz Supabase bazasiga saqlandi.");
        return;
      }

      console.error("Vakansiyani Supabase bazasiga yozib bo‘lmadi:", error);
    }

    try {
      const localJobs = readLocalJobs();
      saveLocalJobs([newJob, ...localJobs]);
      setJobs((current) => [newJob, ...current]);
      setPostOpen(false);
      setIsDemo(true);
      setToast(
        supabase
          ? "Supabase saqlamadi. Vakansiya ushbu brauzerda saqlandi."
          : "Vakansiya demo rejimida ushbu brauzerda saqlandi.",
      );
    } catch (error) {
      console.error("Vakansiyani zaxiraga saqlashda xatolik:", error);
      setToast("Vakansiyani saqlab bo‘lmadi. Qayta urinib ko‘ring.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080a12] text-slate-100 selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-48 -top-56 h-[34rem] w-[34rem] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute right-[-10rem] top-[30rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-16rem] left-[35%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.07] bg-[#080a12]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="group flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <Code2 className="h-5 w-5 text-white" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#080a12] bg-emerald-400" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              DevJobs<span className="text-violet-400">.uz</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#jobs"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Vakansiyalar
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Biz haqimizda
            </a>
            <a
              href="#companies"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Kompaniyalar
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="max-w-40 truncate text-sm text-slate-300">
                  {user.email}
                </span>
                <button
                  onClick={() => void handleSignOut()}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Kirish
              </button>
            )}
            <button
              onClick={() => {
                if (!user) {
                  setAuthMode("login");
                  setAuthOpen(true);
                } else {
                  setPostOpen(true);
                }
              }}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:from-violet-500 hover:to-indigo-400"
            >
              <Plus className="h-4 w-4 transition group-hover:rotate-90" />
              Vakansiya joylash
            </button>
          </div>

          <button
            aria-label="Menyuni ochish"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.07] bg-[#0b0e19] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-4">
              <a href="#jobs" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300">
                Vakansiyalar
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300">
                Biz haqimizda
              </a>
              <a href="#companies" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-300">
                Kompaniyalar
              </a>
              {user ? (
                <button onClick={() => void handleSignOut()} className="w-fit text-sm text-slate-300">
                  Hisobdan chiqish
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="w-fit text-left text-sm text-slate-300"
                >
                  Kirish / Ro‘yxatdan o‘tish
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) setPostOpen(true);
                  else setAuthOpen(true);
                }}
                className="w-fit rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Vakansiya joylash
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3.5 py-2 text-xs font-medium text-violet-200 sm:text-sm">
            <Sparkles className="h-4 w-4 text-violet-300" />
            O‘zbekiston IT hamjamiyatining ish maydoni
            <ArrowRight className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Karyerangizning{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              keyingi bosqichi
            </span>
            <br className="hidden sm:block" /> shu yerdan boshlanadi.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            O‘zingizga mos IT ishini toping yoki jamoangiz uchun eng yaxshi
            mutaxassislarni kashf eting.
          </p>

          <div className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-2 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="h-5 w-5 shrink-0 text-violet-300" />
              <input
                aria-label="Vakansiyalarni qidirish"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Lavozim, kompaniya yoki texnologiya..."
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Qidiruvni tozalash"
                  className="text-slate-500 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110 sm:min-w-36"
            >
              Qidirish
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-slate-500 sm:text-sm">
            <span className="mr-1">Ommabop:</span>
            {["React", "Python", "Remote", "UI/UX"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-slate-400 transition hover:border-violet-400/30 hover:text-violet-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            {
              value: "1,200+",
              label: "Faol vakansiya",
              icon: BriefcaseBusiness,
              action: () => scrollToSection("jobs"),
            },
            {
              value: `${companies.length}+`,
              label: "Kompaniya",
              icon: Building2,
              action: () => scrollToSection("companies"),
            },
            {
              value: "8,000+",
              label: "Mutaxassis",
              icon: Users,
              action: () => {
                setAuthMode("signup");
                setAuthOpen(true);
              },
            },
            {
              value: "24/7",
              label: "Yangi imkoniyat",
              icon: Globe2,
              action: () => {
                setSearchQuery("");
                setActiveCategory("Barchasi");
                scrollToSection("jobs");
              },
            },
          ].map(({ value, label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-5 text-center backdrop-blur-xl transition hover:border-violet-400/20 hover:bg-white/[0.055]"
            >
              <Icon className="mx-auto mb-2 h-4 w-4 text-violet-300" />
              <div className="text-xl font-bold tracking-tight text-white sm:text-2xl">{value}</div>
              <div className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</div>
            </button>
          ))}
        </div>
      </section>

      <section id="jobs" className="relative z-10 mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_2px_rgba(167,139,250,0.55)]" />
              Har kuni yangi imkoniyatlar
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              So‘nggi vakansiyalar
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Tajribangiz va maqsadlaringizga mos ishni toping.
            </p>
          </div>
          <button
            onClick={() => {
              if (!user) {
                setAuthMode("login");
                setAuthOpen(true);
              } else {
                setPostOpen(true);
              }
            }}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
          >
            <Plus className="h-4 w-4 text-violet-300" />
            E’lon joylash
          </button>
        </div>

        <div className="mb-7 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="mr-1 h-4 w-4 shrink-0 text-slate-500" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "border-violet-400/40 bg-violet-500/15 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                  : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
          <div className="ml-auto hidden shrink-0 items-center gap-1 text-xs text-slate-500 sm:flex">
            Eng yangilari
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>

        {isDemo && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/75">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            Demo rejimi: namuna vakansiyalar ko‘rsatilmoqda. Supabase’ni sozlasangiz,
            e’lonlar bazadan yuklanadi.
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/[0.08]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/5 rounded bg-white/[0.08]" />
                    <div className="h-3 w-2/5 rounded bg-white/[0.06]" />
                  </div>
                </div>
                <div className="mt-6 h-3 w-full rounded bg-white/[0.06]" />
                <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.06]" />
                <div className="mt-6 flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
                  <div className="h-6 w-20 rounded-full bg-white/[0.06]" />
                  <div className="h-6 w-14 rounded-full bg-white/[0.06]" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-600" />
            <h3 className="mt-4 text-lg font-semibold text-white">Vakansiya topilmadi</h3>
            <p className="mt-2 text-sm text-slate-400">
              Qidiruv so‘zini yoki tanlangan kategoriyani o‘zgartirib ko‘ring.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Barchasi");
              }}
              className="mt-5 text-sm font-semibold text-violet-300 hover:text-violet-200"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleJobs.map((job, index) => (
              <article
                key={job.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d101b]/80 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/25 hover:bg-[#111423] hover:shadow-xl hover:shadow-violet-950/20 sm:p-6"
              >
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-lg ${
                      index % 4 === 0
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                        : index % 4 === 1
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : index % 4 === 2
                            ? "bg-gradient-to-br from-fuchsia-500 to-pink-600"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    }`}
                  >
                    {job.company.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <button
                        type="button"
                        onClick={() => setApplicationJob(job)}
                        className="text-left text-base font-semibold leading-6 text-white transition hover:text-violet-200 group-hover:text-violet-100 sm:text-lg"
                      >
                        {job.title}
                      </button>
                      <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-300" />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
                      <span>{job.company}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-600" />
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label={`${job.title} vakansiyasini saqlash`}
                    onClick={() => setToast("Vakansiyani saqlash uchun profilingizga kiring.")}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-violet-300"
                  >
                    <ShieldCheck className="h-[18px] w-[18px]" />
                  </button>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-400">
                  {job.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-200">{job.salary}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatPostedDate(job.created_at)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApplicationJob(job)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
                  >
                    Ariza topshirish
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && visibleJobs.length > 0 && (
          <div className="mt-9 text-center text-sm text-slate-500">
            {visibleJobs.length} ta vakansiya ko‘rsatilmoqda
          </div>
        )}
      </section>

      <section
        id="companies"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 sm:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-300">
              <Building2 className="h-4 w-4" />
              O‘zbekiston IT jamoalari
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Kompaniyalar
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Kompaniyani tanlab, uning ochiq vakansiyalarini ko‘ring.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("jobs")}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/[0.08]"
          >
            Barcha vakansiyalar
            <ArrowRight className="h-4 w-4 text-cyan-300" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.035]"
              />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 text-center text-sm text-slate-400">
            Hozircha kompaniyalar yo‘q. Birinchi vakansiyani joylashtiring.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company, index) => (
              <button
                key={company.name}
                type="button"
                onClick={() => showCompanyJobs(company.name)}
                className="group rounded-2xl border border-white/[0.08] bg-[#0d101b]/75 p-5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-[#111423] hover:shadow-xl hover:shadow-cyan-950/15"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${
                      index % 4 === 0
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                        : index % 4 === 1
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                          : index % 4 === 2
                            ? "bg-gradient-to-br from-fuchsia-500 to-pink-600"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600"
                    }`}
                  >
                    {company.name.slice(0, 1).toUpperCase()}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
                </div>
                <h3 className="mt-4 font-semibold text-white group-hover:text-cyan-100">
                  {company.name}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </span>
                  <span>
                    {company.openings}{" "}
                    {company.openings === 1 ? "vakansiya" : "vakansiya"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section id="about" className="relative z-10 border-y border-white/[0.06] bg-white/[0.018]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Nega DevJobs.uz?
            </div>
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              IT karyerangiz uchun bitta ishonchli manzil.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-slate-400">
              Mahalliy va xalqaro kompaniyalarning imkoniyatlarini bir joyda
              ko‘ring. Ko‘nikmalaringizga mos rolni toping va keyingi qadamingizni
              ishonch bilan qo‘ying.
            </p>
            <a
              href="#jobs"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/[0.08] px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/[0.14]"
            >
              Vakansiyalarni ko‘rish
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div id="employers" className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Search,
                title: "Oson qidiruv",
                text: "Lavozim, yo‘nalish va texnologiyalar bo‘yicha filtrlang.",
                color: "text-violet-300",
                action: () => {
                  setSearchQuery("");
                  scrollToSection("jobs");
                },
              },
              {
                icon: ShieldCheck,
                title: "Ishonchli e’lonlar",
                text: "Mahalliy IT jamoalaridan dolzarb imkoniyatlar.",
                color: "text-cyan-300",
                action: () => scrollToSection("companies"),
              },
              {
                icon: Users,
                title: "Kuchli hamjamiyat",
                text: "O‘zbekiston dasturchilari bilan birga rivojlaning.",
                color: "text-fuchsia-300",
                action: () => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                },
              },
              {
                icon: Check,
                title: "Tez boshlash",
                text: "Profil yarating va sizga mos ishni toping.",
                color: "text-emerald-300",
                action: () => {
                  if (user) {
                    scrollToSection("jobs");
                  } else {
                    setAuthMode("signup");
                    setAuthOpen(true);
                  }
                },
              },
            ].map(({ icon: Icon, title, text, color, action }) => (
              <button
                key={title}
                type="button"
                onClick={action}
                className="rounded-2xl border border-white/[0.07] bg-[#0d101b]/70 p-5 text-left transition hover:border-violet-400/25 hover:bg-[#111423]"
              >
                <Icon className={`mb-4 h-5 w-5 ${color}`} />
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
        <a href="#" className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Code2 className="h-4 w-4 text-violet-300" />
          DevJobs<span className="text-violet-400">.uz</span>
        </a>
        <p className="text-xs text-slate-500">
          © 2026 DevJobs.uz — O‘zbekiston IT hamjamiyati uchun.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          O‘zbekistonda yaratilgan
        </div>
      </footer>

      {authOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAuthOpen(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#101321] p-6 shadow-2xl shadow-black/50 sm:p-8">
            <button
              onClick={() => setAuthOpen(false)}
              aria-label="Modalni yopish"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-violet-300">
              <Code2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {authMode === "login" ? "Xush kelibsiz!" : "Hisob yarating"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {authMode === "login"
                ? "Davom etish uchun hisobingizga kiring."
                : "Yangi imkoniyatlarni kashf etish uchun ro‘yxatdan o‘ting."}
            </p>
            {!supabase && (
              <div className="mt-4 rounded-lg border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2 text-xs leading-5 text-amber-100/70">
                Demo rejimi: istalgan email va parol bilan davom etishingiz mumkin.
              </div>
            )}
            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Email manzil
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="siz@example.com"
                  className={inputClass}
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Parol
                <input
                  name="password"
                  type="password"
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                  placeholder="Kamida 6 ta belgi"
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110"
              >
                {authMode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              {authMode === "login" ? "Hisobingiz yo‘qmi?" : "Hisobingiz bormi?"}{" "}
              <button
                onClick={() =>
                  setAuthMode((current) =>
                    current === "login" ? "signup" : "login",
                  )
                }
                className="font-semibold text-violet-300 transition hover:text-violet-200"
              >
                {authMode === "login" ? "Ro‘yxatdan o‘ting" : "Kirish"}
              </button>
            </p>
          </div>
        </div>
      )}

      {applicationJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setApplicationJob(null);
          }}
        >
          <div className="relative my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#101321] p-6 shadow-2xl shadow-black/50 sm:p-8">
            <button
              type="button"
              onClick={() => setApplicationJob(null)}
              aria-label="Ariza oynasini yopish"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">Vakansiyaga ariza</h2>
            <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
              <p className="font-semibold text-white">{applicationJob.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                <Building2 className="h-4 w-4" />
                {applicationJob.company}
                <span className="px-1 text-slate-600">·</span>
                {applicationJob.location}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Aloqa ma’lumotlaringizni yuboring. Kompaniya siz bilan bog‘lanishi
              uchun email va telefon raqamingizni to‘g‘ri kiriting.
            </p>
            <form onSubmit={handleApplicationSubmit} className="mt-5 space-y-4">
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Ism va familiya *
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ism Familiya"
                  className={inputClass}
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Email manzil *
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={user?.email ?? ""}
                    placeholder="siz@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </span>
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Telefon raqami *
                <span className="relative block">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+998 90 123 45 67"
                    className={`${inputClass} pl-10`}
                  />
                </span>
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-300">
                Qisqacha tanishtiruv
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tajribangiz va nima uchun bu ishga mos kelishingiz haqida yozing..."
                  className={`${inputClass} resize-y`}
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-700/15 transition hover:brightness-110"
              >
                Arizani yuborish
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-xs leading-5 text-slate-500">
                Demo rejimida ariza ushbu brauzerda saqlanadi.
              </p>
            </form>
          </div>
        </div>
      )}

      {postOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPostOpen(false);
          }}
        >
          <div className="relative my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101321] p-6 shadow-2xl shadow-black/50 sm:p-8">
            <button
              onClick={() => setPostOpen(false)}
              aria-label="Modalni yopish"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">Vakansiya joylash</h2>
            <p className="mt-2 text-sm text-slate-400">
              Jamoangizga kerakli mutaxassisni topish uchun e’lon yarating.
            </p>
            <form onSubmit={handlePostSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Lavozim nomi *
                <input name="title" required placeholder="Masalan, Frontend Developer" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Kompaniya *
                <input name="company" required placeholder="Kompaniya nomi" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Joylashuv *
                <input name="location" required placeholder="Toshkent · Gibrid" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Yo‘nalish *
                <select name="category" defaultValue="Frontend" className={inputClass}>
                  {categories.filter((category) => category !== "Barchasi").map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Ish turi
                <select name="type" defaultValue="To‘liq stavka" className={inputClass}>
                  <option>To‘liq stavka</option>
                  <option>Yarim stavka</option>
                  <option>Shartnoma asosida</option>
                  <option>Amaliyot</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300">
                Maosh
                <input name="salary" placeholder="$2,000 – $3,000" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300 sm:col-span-2">
                Texnologiyalar (vergul bilan)
                <input name="tags" placeholder="React, TypeScript, Tailwind" className={inputClass} />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-300 sm:col-span-2">
                Vakansiya haqida *
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Vazifalar, talablar va jamoa haqida qisqacha yozing..."
                  className={`${inputClass} resize-y`}
                />
              </label>
              <button
                type="submit"
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110 sm:col-span-2"
              >
                E’lonni saqlash
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border border-white/10 bg-[#171a28] px-4 py-3.5 text-sm text-slate-200 shadow-2xl shadow-black/40"
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
          <span className="flex-1 leading-5">{toast}</span>
          <button onClick={() => setToast("")} aria-label="Bildirishnomani yopish" className="text-slate-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </main>
  );
}
