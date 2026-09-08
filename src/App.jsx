import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";

import "@fontsource/onest/cyrillic-400.css";
import "@fontsource/onest/cyrillic-500.css";
import "@fontsource/onest/cyrillic-600.css";
import "@fontsource/onest/cyrillic-700.css";
import "@fontsource/onest/latin-400.css";
import "@fontsource/onest/latin-500.css";
import "@fontsource/onest/latin-600.css";
import "@fontsource/onest/latin-700.css";

const external = {
  telegram: "https://t.me/ruslan_avn",
  behance: "https://www.behance.net/ruslan_averin",
  dprofile: "https://dprofile.ru/averinruslan",
  cv: "https://disk.yandex.ru/i/xnEnHpvY4Nxo4w",
};

const githubPagesRoot = window.location.pathname === "/portfolio" || window.location.pathname.startsWith("/portfolio/")
  ? "/portfolio"
  : "";
const sitePath = (path) => `${githubPagesRoot}${path}`;

let activePageScroll = 0;

function cancelPageScroll() {
  if (activePageScroll) window.cancelAnimationFrame(activePageScroll);
  activePageScroll = 0;
}

function animatePageScroll(destination, duration = 1100) {
  cancelPageScroll();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollLimit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const target = Math.min(Math.max(destination, 0), scrollLimit);

  if (reducedMotion) {
    window.scrollTo(0, target);
    return;
  }

  const start = window.scrollY;
  const distance = target - start;
  const startedAt = performance.now();

  const step = (time) => {
    const progress = Math.min((time - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      activePageScroll = window.requestAnimationFrame(step);
    } else {
      activePageScroll = 0;
    }
  };

  activePageScroll = window.requestAnimationFrame(step);
}

function FlipLink({ href, children, className = "", externalLink = false, arrow = false, buttonArrow = false, onClick }) {
  return (
    <a
      className={`flip-link ${className}`.trim()}
      href={href}
      onClick={onClick}
      {...(externalLink ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className="flip-link__window" aria-hidden="true">
        <span className="flip-link__track">
          <span className="flip-link__face">{children}</span>
          <span className="flip-link__face">{children}</span>
        </span>
      </span>
      {arrow && <span className="external-arrow" aria-hidden="true" />}
      {buttonArrow && <ArrowRight className="button-arrow" size={16} strokeWidth={2} aria-hidden="true" />}
      <span className="sr-only">{children}{arrow ? " — открыть" : ""}</span>
    </a>
  );
}

function Header({ isCase = false }) {
  const root = isCase ? sitePath("/") : "";
  const openSection = (sectionId) => (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const currentPath = window.location.pathname.slice(githubPagesRoot.length).replace(/\/$/, "") || "/";
    const isHomePage = currentPath === "/";

    if (!isHomePage) {
      event.preventDefault();
      window.sessionStorage.setItem("portfolio-scroll-target", sectionId);
      window.location.assign(sitePath("/"));
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    window.history.replaceState(null, "", `#${sectionId}`);
    animatePageScroll(section.getBoundingClientRect().top + window.scrollY);
  };

  return (
    <header className={`site-header ${isCase ? "site-header--case" : ""}`.trim()}>
      <nav className="header-shell" aria-label="Основная навигация">
        <a className="brand-mark" href={sitePath("/")} aria-label="На главную">
          <img src={sitePath("/assets/brand-mark.svg")} alt="" aria-hidden="true" />
        </a>

        <div className="header-links">
          <FlipLink href={`${root}#projects`} onClick={openSection("projects")} arrow>Проекты</FlipLink>
          <FlipLink href={`${root}#experience`} onClick={openSection("experience")} arrow>Опыт</FlipLink>
          <FlipLink href={external.cv} externalLink arrow>CV</FlipLink>
        </div>

        <FlipLink className="telegram-button" href={external.telegram} externalLink buttonArrow>
          Написать в тг
        </FlipLink>
      </nav>
    </header>
  );
}

function ProjectPhones({ project }) {
  const data = project === "nova"
    ? {
        color: "blue",
        alt: "Экраны мобильного банка NovaBank",
        images: ["nova-home.png", "nova-analytics.webp", "nova-profile.webp"],
      }
    : {
        color: "orange",
        alt: "Экраны онлайн-кинотеатра Smile",
        images: ["smile-catalog.webp", "smile-detail.webp", "smile-watch.webp"],
      };

  return (
    <div className={`project-visual project-visual--${data.color}`}>
      <div className="phone-stage">
        {data.images.map((image, index) => (
          <img
            alt={`${data.alt}, экран ${index + 1}`}
            className={`project-phone project-phone--${index + 1}`}
            key={image}
            loading="lazy"
            src={sitePath(`/assets/${image}`)}
          />
        ))}
      </div>
      <span className="project-arrow" aria-hidden="true"><img src={sitePath("/assets/project-arrow.svg")} alt="" /></span>
    </div>
  );
}

function ProjectCard({ project }) {
  const isNova = project === "nova";
  const href = sitePath(isNova ? "/novabank" : "/smile-cinema");
  const title = isNova ? "NovaBank" : "Smile";
  const description = isNova ? "Приложение мобильного банка" : "Приложение онлайн-кинотеатра";
  const tags = isNova
    ? ["FinTech", "B2C", "iOS", "Light/Dark theme", "2025"]
    : ["Streaming media", "B2C", "iOS", "Light/Dark theme", "2025"];

  return (
    <article className="project-card reveal">
      <a className="project-card__link" href={href} aria-label={`Открыть кейс ${title}`}>
        <ProjectPhones project={project} />
      </a>
      <div className="project-card__caption">
        <div>
          <h3><a href={href}>{title}</a></h3>
          <p>{description}</p>
        </div>
        <ul className="tag-list" aria-label="Характеристики проекта">
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}

function HomePage() {
  useEffect(() => {
    const sectionId = window.sessionStorage.getItem("portfolio-scroll-target");
    if (!sectionId) return undefined;

    window.sessionStorage.removeItem("portfolio-scroll-target");
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      window.history.replaceState(null, "", `#${sectionId}`);
      animatePageScroll(section.getBoundingClientRect().top + window.scrollY);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="site site--home">
      <SmoothScroll />
      <main>
        <section className="home-hero">
          <img className="hero-cord" src={sitePath("/assets/hero-cord.webp")} alt="" aria-hidden="true" />
          <div className="hero-card">
            <Header />
            <div className="hero-profile reveal is-visible">
              <img className="hero-portrait" src={sitePath("/assets/portrait.webp")} alt="Руслан Аверин" />
              <h1>Руслан Аверин</h1>
              <p className="hero-role">B2C Product designer</p>
              <p className="hero-description">
                Проектирую понятные и выразительные<span className="desktop-break"><br /></span> продукты для mobile и web — от сценария<span className="desktop-break"><br /></span> до готового интерфейса
              </p>
              <FlipLink className="telegram-button telegram-button--hero" href={external.telegram} externalLink buttonArrow>
                Написать в тг
              </FlipLink>
            </div>
          </div>
        </section>

        <section className="projects-section section-shell" id="projects">
          <h2>Проекты</h2>
          <div className="project-list">
            <ProjectCard project="nova" />
            <ProjectCard project="smile" />
          </div>
        </section>

        <section className="experience-section section-shell" id="experience">
          <h2>Коммерческий опыт</h2>
          <div className="experience-list">
            <article className="experience-row reveal">
              <div className="experience-meta">
                <h3>UDS</h3>
                <p>2025 — настоящее время</p>
              </div>
              <div className="experience-copy">
                <h4>Веб-дизайнер</h4>
                <p>Проектирую и собираю лендинги в Webflow для продуктовой компании, развивающей крупнейшую систему лояльности в СНГ. Помогаю объяснять возможности сервиса через понятные digital-страницы, поддерживаю основной сайт и создаю визуальные материалы для социальных сетей.</p>
                <ul>
                  <li>Дизайн и сборка лендингов в Webflow</li>
                  <li>Развитие и техническая поддержка основного сайта</li>
                  <li>Визуальные коммуникации для продуктовых и маркетинговых каналов</li>
                </ul>
              </div>
            </article>

            <article className="experience-row reveal">
              <div className="experience-meta">
                <h3>Фриланс</h3>
                <p>2024 — 2025</p>
              </div>
              <div className="experience-copy">
                <h4>Веб-дизайнер</h4>
                <p>Разрабатывал лендинги: создавал дизайн и самостоятельно собирал страницы в Tilda. Оформлял презентации и визуальные материалы.</p>
                <p>Отвечал за коммуникацию с заказчиком, вёл работу от макета до готовой опубликованной страницы, учитывая адаптивность и цели клиента.</p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer section-shell">
      <p>Руслан Аверин · © 2026</p>
      <div className="footer-links">
        <FlipLink href={external.telegram} externalLink arrow>Tg</FlipLink>
        <FlipLink href={external.behance} externalLink arrow>Be</FlipLink>
        <FlipLink href={external.dprofile} externalLink arrow>Dp</FlipLink>
        <FlipLink href={external.cv} externalLink arrow>CV</FlipLink>
      </div>
    </footer>
  );
}

const cases = {
  "/novabank": {
    title: "NovaBank",
    label: "Приложение\nонлайн-банка",
    accent: "blue",
    hero: "nova-case-hero.webp",
    phones: ["nova-onboarding-phone.webp", "nova-onboarding-welcome.webp", "nova-onboarding-faceid.webp"],
    detailScreens: ["nova-transfer-amount.webp", "nova-transfer-success.webp"],
    researchScreens: ["nova-onboarding-phone.webp", "nova-onboarding-welcome.webp", "nova-onboarding-faceid.webp"],
    resultScreens: ["nova-transfer-amount.webp", "nova-transfer-success.webp"],
    finalImage: "nova-case-final.webp",
    context: (
      <>
        <p>Мобильные банки объединяют десятки сценариев: переводы, платежи, управление картами и счетами, историю операций, поиск банкоматов, курсы валют и оформление новых продуктов.</p>
        <p>В NovaBank я исследовал повседневные финансовые задачи и спроектировал полноценную MVP-версию, в которой основные действия доступны с главного экрана, а дополнительные возможности раскрываются по мере необходимости.</p>
        <p>Всего получилось 210 экранов для светлой и тёмной тем приложения.</p>
      </>
    ),
    goal: {
      task: "Спроектировать концепт мобильного банка, который покрывает основные финансовые сценарии, сохраняя понятную навигацию и предсказуемую логику взаимодействия.",
      user: "Быстро управлять деньгами, выполнять регулярные операции и контролировать их результат.",
      business: "Повысить регулярность использования приложения и сделать дополнительные банковские продукты заметными без перегрузки главного экрана.",
    },
    research: (
      <>
        <p>Чтобы определить потребности и сценарии использования банков, я провёл интервью с пользователями, сформулировал пользовательские задачи по JTBD и построил CJM для переводов — основного действия.</p>
        <p>В ходе бенчмаркинга Альфа-Банка, Т-Банка, РНКБ и Сбера определил функционал приложения. Необходимость внедрения функций проверял с помощью сводного анализа.</p>
      </>
    ),
    metrics: [
      "долю пользователей, успешно завершивших перевод, платёж или пополнение;",
      "время выполнения основных операций и количество возвратов на предыдущие шаги;",
      "повторное использование переводов, платежей и аналитики;",
      "конверсию из просмотра банковского продукта в оформление карты;",
      "количество незавершённых операций и обращений в поддержку.",
    ],
    results: [
      "информационная архитектура приложения;",
      "структура экранов и состояний;",
      "интерактивный прототип;",
      "дизайн-система;",
      "интерфейс в светлой и тёмной темах;",
      "макеты, подготовленные для передачи в разработку.",
    ],
    resultLead: "Я разработал концепт мобильного банка, охватывающий основные пользовательские сценарии: регистрацию, управление счетами и картами, переводы, платежи, финансовую аналитику и настройки.",
    next: "Поскольку продукт не запускался, я не приписываю ему бизнес-результаты. Следующим этапом стало бы тестирование целевого сценария.",
  },
  "/smile-cinema": {
    title: "Smile",
    label: "Приложение онлайн-кинотеатра",
    accent: "orange",
    hero: "smile-case-hero.webp",
    phones: ["smile-subscription-intro.webp", "smile-subscription-plans.webp", "smile-subscription-payment.webp"],
    detailScreens: ["smile-actor.png", "smile-movie-detail.webp"],
    researchScreens: ["smile-tv.png", "smile-channel.webp", "smile-filters.png"],
    resultScreens: ["smile-catalog.png", "smile-profile.png"],
    finalImage: "smile-case-final.png",
    context: (
      <>
        <p>Онлайн-кинотеатр должен помогать не только смотреть контент, но и быстро выбирать его среди большого количества фильмов, сериалов и трансляций.</p>
        <p>В Smile я исследовал сценарии выбора и просмотра контента и спроектировал приложение, объединяющее персональные рекомендации, каталог, ТВ-каналы и прямые трансляции. Пользователь может изучить информацию о фильме и актёрах, выбрать перевод, сохранить или загрузить контент и продолжить просмотр на другом устройстве.</p>
        <p>Всего получилось более 120 экранов для светлой и тёмной тем приложения.</p>
      </>
    ),
    goal: {
      task: "Спроектировать концепт мобильного онлайн-кинотеатра, охватывающий путь от первого входа и выбора интересов до поиска, оформления подписки и просмотра контента.",
      user: "Быстро находить подходящий контент, принимать решение на основе понятной информации и смотреть его в удобное время — в том числе без подключения к интернету.",
      business: "Повысить ценность подписки за счёт персонализации, офлайн-доступа и объединения фильмов, сериалов и прямых трансляций. Увеличить частоту возвращений в приложение и конверсию в оформление и продление подписки.",
    },
    research: (
      <>
        <p>Чтобы определить основные потребности аудитории, я провёл пользовательское исследование, сформировал персоны и описал задачи с помощью JTBD. Для ключевых сценариев подготовил User Flow и CJM.</p>
        <p>Конкурентный и функциональный анализ онлайн-кинотеатров помог определить состав продукта и построить информационную архитектуру вокруг основных разделов: главной страницы, каталога, избранного, ТВ и личного кабинета.</p>
      </>
    ),
    metrics: [
      "долю новых пользователей, настроивших рекомендации и начавших первый просмотр;",
      "время от открытия приложения до запуска фильма, сериала или трансляции;",
      "конверсию из карточки контента в просмотр и из предложения подписки в оплату;",
      "повторное использование рекомендаций, избранного, загрузок и истории просмотров;",
      "количество незавершённых регистраций, оплат и запусков контента.",
    ],
    results: [
      "информационная архитектура и ключевые пользовательские сценарии;",
      "функциональный и интерактивный прототип;",
      "каталог, фильтры и персональные подборки;",
      "карточки фильмов и актёров, видеоплеер и ТВ-раздел;",
      "дизайн-система и интерфейс в светлой и тёмной темах;",
      "более 120 экранов и спецификация для передачи в разработку.",
    ],
    resultLead: "Основной сценарий был проверен на прототипе, после чего я доработал структуру и исправил найденные ошибки.",
    next: "Поскольку продукт не запускался, я не приписываю ему бизнес-результаты. Следующим этапом стало бы тестирование пути от рекомендации до просмотра и сценария оформления подписки.",
  },
};

function CasePhones({ item, images = item.phones, className = "" }) {
  return (
    <div className={`case-phone-stage case-phone-stage--${item.accent} ${className} reveal`.trim()}>
      {images.map((image, index) => (
        <img key={image} src={sitePath(`/assets/${image}`)} alt={`Экран ${index + 1} приложения ${item.title}`} loading="lazy" />
      ))}
    </div>
  );
}

function CaseSection({ title, children, className = "" }) {
  return (
    <section className={`case-row reveal ${className}`.trim()}>
      <h2>{title}</h2>
      <div className="case-copy">{children}</div>
    </section>
  );
}

function CaseScreenPair({ item, images }) {
  return (
    <div className="case-screen-pair reveal" aria-label={`Дополнительные экраны приложения ${item.title}`}>
      {images.map((image, index) => (
        <div key={image}>
          <img src={sitePath(`/assets/${image}`)} alt={`Дополнительный экран ${index + 1} приложения ${item.title}`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}

function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? Math.min(window.scrollY / maximum, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}

function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) return undefined;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let current = window.scrollY;
    let target = current;
    let frame = 0;
    let animating = false;

    const limit = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const animate = () => {
      animating = true;
      current += (target - current) * 0.14;

      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        animating = false;
        frame = 0;
        return;
      }

      window.scrollTo(0, current);
      frame = window.requestAnimationFrame(animate);
    };

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      event.preventDefault();
      cancelPageScroll();
      const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      target = Math.min(Math.max(target + event.deltaY * multiplier, 0), limit());

      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const syncPosition = () => {
      if (!animating) {
        current = window.scrollY;
        target = current;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", syncPosition, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", syncPosition);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
      setVisible(scrollProgress >= 0.9);
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      className={`back-to-top ${visible ? "back-to-top--visible" : ""}`.trim()}
      type="button"
      aria-label="Вернуться наверх"
      onClick={scrollToTop}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

function CasePage({ item }) {
  return (
    <div className={`site case-site case-site--${item.accent}`}>
      <SmoothScroll />
      <ScrollProgress />
      <Header isCase />
      <BackToTop />
      <main className="case-main">
        <section className="case-heading reveal is-visible">
          <h1>{item.title}</h1>
          <p>{item.label}</p>
        </section>

        <div className="case-hero reveal is-visible">
          <img src={sitePath(`/assets/${item.hero}`)} alt={`Презентационное изображение проекта ${item.title}`} />
        </div>

        <CaseSection title="Контекст">{item.context}</CaseSection>
        <CasePhones item={item} />

        <CaseSection title="Задача и цели">
          <dl className="goals-list">
            <div><dt>Задача</dt><dd>{item.goal.task}</dd></div>
            <div><dt>Цель пользователя</dt><dd>{item.goal.user}</dd></div>
            <div><dt>Цель бизнеса</dt><dd>{item.goal.business}</dd></div>
          </dl>
        </CaseSection>

        <CaseScreenPair item={item} images={item.detailScreens} />

        <CaseSection title="Оценка успеха">
          <p>После запуска я бы отслеживал:</p>
          <ul>{item.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
          <p className="case-note">Для концепта это критерии будущей проверки, а не достигнутые показатели.</p>
        </CaseSection>

        <CasePhones item={item} images={item.researchScreens} className="case-phone-stage--research" />

        <CaseSection title="Исследование">{item.research}</CaseSection>
        <CaseScreenPair item={item} images={item.resultScreens} />

        <CaseSection title="Результат">
          <p>{item.resultLead}</p>
          <p>В рамках проекта были созданы:</p>
          <ul>{item.results.map((result) => <li key={result}>{result}</li>)}</ul>
          <p>{item.next}</p>
        </CaseSection>

        <div className="case-final-image reveal">
          <img src={sitePath(`/assets/${item.finalImage}`)} alt={`Финальная подборка экранов проекта ${item.title}`} loading="lazy" />
        </div>

        <p className="case-thanks reveal">Спасибо за просмотр</p>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="site not-found">
      <Header isCase />
      <main>
        <p>404</p>
        <h1>Страница не найдена</h1>
        <a href={sitePath("/")}>Вернуться на главную</a>
      </main>
    </div>
  );
}

export function App() {
  const fullPath = window.location.pathname.replace(/\/$/, "") || "/";
  const path = githubPagesRoot && fullPath.startsWith(githubPagesRoot)
    ? fullPath.slice(githubPagesRoot.length) || "/"
    : fullPath;

  if (path === "/") return <HomePage />;
  if (cases[path]) return <CasePage item={cases[path]} />;
  return <NotFound />;
}
