"use client";
import { useState } from "react";
import { about, animals, codeIntro, instruments, journey, languages, links, moreProjects, musicVideos, origami, projects, running, type Project } from "@/data/profile";
import { useDesktop, type WinId } from "./desktop-context";
import Photo from "./Photo";
import Crane from "./Crane";
import Casio from "./Casio";
import RunChart from "./RunChart";
import Greeting from "./Greeting";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Chip({ to, children }: { to: WinId; children: React.ReactNode }) {
  const { open } = useDesktop();
  return (
    <button className="chip" onClick={() => open(to)}>
      {children}
    </button>
  );
}

export function About() {
  const a = about.avatar;
  const medal = running.photos[0];
  const [first, second, ...rest] = about.paragraphs;
  return (
    <>
      <div className="cover" aria-hidden="true" />
      <div className="me">
        <Photo src={a.src} alt={a.alt} cap={a.cap} w={220} h={220} sizes="80px" zoomTo={{ ...medal, cap: a.cap }} />
        <div>
          <h3>{about.title}</h3>
          <div className="role">{about.role}</div>
        </div>
      </div>

      <dl className="glance">
        {about.glance.map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>{g.value}</dd>
          </div>
        ))}
      </dl>

      <p className="lead">{first}</p>
      <p>{second}</p>
      <blockquote className="pull">{about.quote}</blockquote>
      {rest.map((p) => (
        <p key={p}>{p}</p>
      ))}

      <div className="explore">Explore</div>
      <div className="chips">
        <Chip to="journey">Journey</Chip>
        <Chip to="code">Code</Chip>
        <Chip to="run">Running</Chip>
        <Chip to="music">Music</Chip>
        <Chip to="origami">Origami</Chip>
        <Chip to="lang">Languages</Chip>
        <Chip to="animals">Animals</Chip>
      </div>
      <div className="sig">
        <span className="muted">
          Say hi → <a href={links.linkedin} {...ext}>LinkedIn</a> · <a href={links.github} {...ext}>GitHub</a>
        </span>
        <b>{about.signature}</b>
      </div>
    </>
  );
}

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="plinks">
      {p.live && <a className="btn-live" href={p.live} {...ext}>Open live ↗</a>}
      {p.code && <a className="btn-code" href={p.code} {...ext}>View code →</a>}
    </div>
  );
}

function ProjectHead({ p }: { p: Project }) {
  return (
    <div className="phead">
      <span className="ic" style={{ background: p.color }}>{p.badge}</span>
      <div>
        <h4>{p.name}</h4>
        <div className="muted">{p.kind}</div>
      </div>
    </div>
  );
}

export function Code() {
  const [featured, ...rest] = projects;
  return (
    <>
      <header className="code-head">
        <h3>{codeIntro.title}</h3>
        <p>{codeIntro.text}</p>
        <dl className="skills">
          {codeIntro.skills.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </header>

      <article className="pcard feature">
        <div className="ftext">
          <div className="tagline">featured</div>
          <ProjectHead p={featured} />
          <p>{featured.summary}</p>
          <ul>{featured.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
          <div className="tags">{featured.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
          <ProjectLinks p={featured} />
          {featured.note && <p className="note">{featured.note}</p>}
        </div>
        <div className="fside">
          {featured.photo && <Photo {...featured.photo} sizes="360px" />}
          {featured.stats && (
            <div className="fstats">
              {featured.stats.map((s) => <div key={s.label}><b>{s.value}</b>{s.label}</div>)}
            </div>
          )}
        </div>
      </article>

      <div className="pgrid">
        {rest.map((p) => (
          <article className="pcard" key={p.name}>
            <ProjectHead p={p} />
            <p>{p.summary}</p>
            <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            <div className="tags">{p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            <ProjectLinks p={p} />
          </article>
        ))}
      </div>

      <section className="more">
        <h4>Smaller builds</h4>
        {moreProjects.map((m) => (
          <a className="mrow" key={m.name} href={m.code} {...ext}>
            <b>{m.name}</b>
            <span>{m.text}</span>
            <span className="muted">{m.stack}</span>
          </a>
        ))}
        <p className="muted" style={{ marginTop: 10 }}>
          Everything else lives on <a href={links.github} {...ext}>GitHub</a> and <a href={links.githubCollege} {...ext}>my college GitHub</a>.
        </p>
      </section>
    </>
  );
}

export function Music() {
  return (
    <>
      <h3>I play instruments</h3>
      <div className="inst">
        {instruments.map((i) => (
          <div key={i.name}>
            <b>{i.name}</b>
            <span>{i.note}</span>
            <div className="yr"><i style={{ width: `${i.level}%` }} /></div>
          </div>
        ))}
      </div>
      <Casio />
      <p className="muted" style={{ margin: "8px 0 0" }}>Click the keys, or play with A S D F G H J K on your keyboard.</p>
      <div className="mvids">
        {musicVideos.map((v) => (
          <div key={v.label}>
            {v.src ? (
              <video src={v.src} controls playsInline preload="metadata" aria-label={`${v.label} video`} />
            ) : (
              <span>{v.label}<br />Video soon</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export function Runs() {
  return (
    <>
      <div className="runtop">
        <div>
          <h3>{running.title}</h3>
          <p className="muted" style={{ margin: 0 }}>{running.note}</p>
          <div className="stats">
            {running.stats.map((s) => (
              <div key={s.label}><b>{s.value}</b>{s.label}</div>
            ))}
          </div>
        </div>
        <div className="clip">
          <video src={running.clip} autoPlay muted loop playsInline aria-label="Short selfie clip from a run" />
          <span>Mid-run</span>
        </div>
      </div>
      <RunChart runs={running.recentRuns} />
      <div className="medals">
        {running.photos.map((p) => (
          <figure key={p.src}>
            <Photo {...p} sizes="260px" />
            <figcaption>{p.cap}</figcaption>
          </figure>
        ))}
      </div>
      <div className="goal">
        <span className="muted">{running.goal.when}</span>
        <b>{running.goal.title}</b>
        <span className="muted">{running.goal.text}</span>
      </div>
    </>
  );
}

export function Languages() {
  return (
    <>
      <Greeting items={languages.greetings} />
      <div className="lgroups">
        <div>
          <span className="muted">Fluent</span>
          {languages.fluent.map((l) => <b key={l}>{l}</b>)}
        </div>
        <div>
          <span className="muted">Learning</span>
          {languages.learning.map((l) => <b key={l}>{l}</b>)}
        </div>
      </div>
    </>
  );
}

export function Origami() {
  const [signal, setSignal] = useState(0);
  return (
    <>
      <h3>{origami.title}</h3>
      <Crane foldAfter={700} toggleSignal={signal} label="Paper crane that folds and unfolds" />
      <div className="btnrow">
        <button className="pbtn" onClick={() => setSignal((s) => s + 1)}>Unfold / fold</button>
      </div>
      <div className="gal">
        {origami.photos.map((p) => (
          <figure key={p.src}>
            <Photo {...p} sizes="160px" />
            <figcaption>{p.short}</figcaption>
          </figure>
        ))}
      </div>
      <p className="muted" style={{ margin: "8px 0 0", textAlign: "center" }}>Tap a photo to unfold it.</p>
    </>
  );
}

export function Journey() {
  return (
    <>
      <h3>Where I&apos;ve been</h3>
      {journey.map((j) => (
        <div className={`jitem ${j.kind ?? ""}`} key={j.title}>
          <span className="dot" />
          <div>
            <div className="when">{j.when}</div>
            <h4>{j.title}</h4>
            <p className="muted">{j.text}</p>
            {j.photos && (
              <div className="jpics">
                {j.photos.map((p) => <Photo key={p.src} {...p} sizes="240px" />)}
              </div>
            )}
          </div>
        </div>
      ))}
      <p className="muted" style={{ margin: "10px 0 0" }}>
        More on <a href={links.linkedin} {...ext}>LinkedIn ↗</a>
      </p>
    </>
  );
}

const CAT_AND_DOG = `  /\\_/\\      / \\__
 ( o.o )    (    @\\___
  > ^ <     /         O
           /   (_____/
          /_____/   U`;

export function Animals() {
  return (
    <>
      <h3>{animals.title}</h3>
      <p>{animals.text}</p>
      <div className="ascii" aria-hidden="true">{CAT_AND_DOG}</div>
      {animals.photos.length > 0 ? (
        <div className="gal">
          {animals.photos.map((p) => (
            <figure key={p.src}>
              <Photo {...p} sizes="160px" />
              <figcaption>{p.short}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}><span className="ph">Photos of my animal friends coming soon.</span></p>
      )}
    </>
  );
}
