// Internationalization utilities for CLEAR Platform
// Supports English, Spanish, Chinese, Vietnamese, Korean, Tagalog

export const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
  },
  tl: {
    code: 'tl',
    name: 'Tagalog',
    nativeName: 'Tagalog',
    flag: '🇵🇭',
  },
};

// Translation strings
export const translations = {
  en: {
    // Navigation
    nav: {
      tools: 'Tools',
      community: 'Community',
      states: 'States',
      tracker: 'Tracker',
      research: 'Research',
      coalition: 'Coalition',
      settings: 'Settings',
      profile: 'Profile',
      login: 'Sign In',
    },
    // Home page
    home: {
      title: 'CLEAR Platform',
      subtitle: 'Making legal and administrative processes accessible to everyone',
      cta: 'Get Started',
      mission: 'Our Mission',
      missionText: 'We believe everyone deserves to understand the rules that govern their lives. CLEAR tools translate complexity into clarity.',
    },
    // Tools
    tools: {
      title: 'Tools',
      subtitle: 'Everything you need to navigate government processes',
      processFinder: 'Process Finder',
      processFinderDesc: 'Describe your situation and get a personalized sequence of processes',
      plainspeak: 'PlainSpeak AI',
      plainspeakDesc: 'Translate legal jargon into plain language',
      processmap: 'ProcessMap',
      processmapDesc: 'Step-by-step guides for government processes',
      calculator: 'Complexity Calculator',
      calculatorDesc: 'Measure any process using 8 dimensions',
      tracker: 'Progress Tracker',
      trackerDesc: 'Track your process completion',
      states: 'State Requirements',
      statesDesc: 'Compare requirements across states',
      community: 'Community',
      communityDesc: 'Share experiences and help others',
      extension: 'Browser Extension',
      extensionDesc: 'Translate text on any webpage',
    },
    // Common
    common: {
      search: 'Search',
      filter: 'Filter',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      noResults: 'No results found',
      learnMore: 'Learn More',
      viewAll: 'View All',
      steps: 'steps',
      cost: 'Cost',
      time: 'Time',
      difficulty: 'Difficulty',
      easy: 'Easy',
      moderate: 'Moderate',
      hard: 'Hard',
      online: 'Online',
      inPerson: 'In Person',
    },
    // PlainSpeak
    plainspeak: {
      title: 'PlainSpeak AI',
      inputPlaceholder: 'Paste legal text here...',
      translateBtn: 'Translate',
      readingLevel: 'Reading Level',
      simple: '5th Grade',
      general: 'General',
      professional: 'Professional',
      riskScore: 'Risk Score',
      concerns: 'Concerns',
      documentType: 'Document Type',
      uploadFile: 'Upload File',
    },
    // Tracker
    tracker: {
      title: 'Progress Tracker',
      subtitle: 'Track your government processes step by step',
      addProcess: 'Track New Process',
      inProgress: 'In Progress',
      completed: 'Completed',
      totalSteps: 'Total Steps',
      stepsDone: 'Steps Done',
      addNotes: 'Add notes...',
      noProcesses: 'No processes tracked yet',
      startTracking: 'Track Your First Process',
    },
    // Community
    community: {
      title: 'Community',
      subtitle: 'Share experiences and help others navigate government processes',
      newPost: 'New Post',
      search: 'Search discussions...',
      mostRecent: 'Most Recent',
      mostUpvoted: 'Most Upvoted',
      mostViewed: 'Most Viewed',
      allTopics: 'All Topics',
      replies: 'replies',
      views: 'views',
      postReply: 'Post Reply',
    },
  },
  es: {
    // Navigation
    nav: {
      tools: 'Herramientas',
      community: 'Comunidad',
      states: 'Estados',
      tracker: 'Seguimiento',
      research: 'Investigación',
      coalition: 'Coalición',
      settings: 'Configuración',
      profile: 'Perfil',
      login: 'Iniciar Sesión',
    },
    // Home page
    home: {
      title: 'Plataforma CLEAR',
      subtitle: 'Haciendo accesibles los procesos legales y administrativos para todos',
      cta: 'Comenzar',
      mission: 'Nuestra Misión',
      missionText: 'Creemos que todos merecen entender las reglas que gobiernan sus vidas. Las herramientas CLEAR traducen la complejidad en claridad.',
    },
    // Tools
    tools: {
      title: 'Herramientas',
      subtitle: 'Todo lo que necesitas para navegar procesos gubernamentales',
      processFinder: 'Buscador de Procesos',
      processFinderDesc: 'Describe tu situación y obtén una secuencia personalizada',
      plainspeak: 'PlainSpeak IA',
      plainspeakDesc: 'Traduce jerga legal a lenguaje simple',
      processmap: 'Mapa de Procesos',
      processmapDesc: 'Guías paso a paso para procesos gubernamentales',
      calculator: 'Calculadora de Complejidad',
      calculatorDesc: 'Mide cualquier proceso usando 8 dimensiones',
      tracker: 'Seguimiento de Progreso',
      trackerDesc: 'Rastrea la finalización de tus procesos',
      states: 'Requisitos por Estado',
      statesDesc: 'Compara requisitos entre estados',
      community: 'Comunidad',
      communityDesc: 'Comparte experiencias y ayuda a otros',
      extension: 'Extensión del Navegador',
      extensionDesc: 'Traduce texto en cualquier página web',
    },
    // Common
    common: {
      search: 'Buscar',
      filter: 'Filtrar',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
      loading: 'Cargando...',
      noResults: 'No se encontraron resultados',
      learnMore: 'Más Información',
      viewAll: 'Ver Todo',
      steps: 'pasos',
      cost: 'Costo',
      time: 'Tiempo',
      difficulty: 'Dificultad',
      easy: 'Fácil',
      moderate: 'Moderado',
      hard: 'Difícil',
      online: 'En línea',
      inPerson: 'En persona',
    },
    // PlainSpeak
    plainspeak: {
      title: 'PlainSpeak IA',
      inputPlaceholder: 'Pega el texto legal aquí...',
      translateBtn: 'Traducir',
      readingLevel: 'Nivel de Lectura',
      simple: '5º Grado',
      general: 'General',
      professional: 'Profesional',
      riskScore: 'Puntuación de Riesgo',
      concerns: 'Preocupaciones',
      documentType: 'Tipo de Documento',
      uploadFile: 'Subir Archivo',
    },
    // Tracker
    tracker: {
      title: 'Seguimiento de Progreso',
      subtitle: 'Rastrea tus procesos gubernamentales paso a paso',
      addProcess: 'Agregar Nuevo Proceso',
      inProgress: 'En Progreso',
      completed: 'Completado',
      totalSteps: 'Total de Pasos',
      stepsDone: 'Pasos Completados',
      addNotes: 'Agregar notas...',
      noProcesses: 'Aún no hay procesos rastreados',
      startTracking: 'Rastrea Tu Primer Proceso',
    },
    // Community
    community: {
      title: 'Comunidad',
      subtitle: 'Comparte experiencias y ayuda a otros a navegar procesos gubernamentales',
      newPost: 'Nueva Publicación',
      search: 'Buscar discusiones...',
      mostRecent: 'Más Reciente',
      mostUpvoted: 'Más Votado',
      mostViewed: 'Más Visto',
      allTopics: 'Todos los Temas',
      replies: 'respuestas',
      views: 'vistas',
      postReply: 'Publicar Respuesta',
    },
  },
  zh: {
    nav: {
      tools: '工具',
      community: '社区',
      states: '各州',
      tracker: '跟踪器',
      research: '研究',
      coalition: '联盟',
      settings: '设置',
      profile: '个人资料',
      login: '登录',
    },
    home: {
      title: 'CLEAR 平台',
      subtitle: '让法律和行政程序对每个人都易于理解',
      cta: '开始使用',
      mission: '我们的使命',
      missionText: '我们相信每个人都应该了解管理自己生活的规则。CLEAR 工具将复杂性转化为清晰度。',
    },
    common: {
      search: '搜索',
      filter: '筛选',
      submit: '提交',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      loading: '加载中...',
      noResults: '未找到结果',
      learnMore: '了解更多',
      viewAll: '查看全部',
      steps: '步骤',
      cost: '费用',
      time: '时间',
      difficulty: '难度',
      easy: '简单',
      moderate: '中等',
      hard: '困难',
      online: '在线',
      inPerson: '现场',
    },
  },
};

// Get translation helper
export function t(lang, key) {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        value = value?.[k2];
        if (value === undefined) return key;
      }
      return value;
    }
  }
  
  return value || key;
}

// Get browser language
export function getBrowserLanguage() {
  const lang = navigator.language?.split('-')[0] || 'en';
  return languages[lang] ? lang : 'en';
}
