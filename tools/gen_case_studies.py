import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

HEAD = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} | James Healey</title>
  <meta name="description" content="{desc}" />
  <meta name="theme-color" content="#d8d7ce" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="https://jameschealey.com/social.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <script>document.documentElement.className += ' js';</script>{head_extra}
</head>
<body>
  <header class="site-header">
    <div class="wrap">
      <a class="logo" href="/" aria-label="James Healey, home">
        <svg viewBox="0 0 100 100" aria-hidden="true"><circle class="ring" cx="50" cy="50" r="45"/><g class="bot"><rect x="30" y="30" width="40" height="40" rx="6"/></g><circle class="eye" cx="50" cy="50" r="8"/></svg>
        <span>James Healey</span>
      </a>
      <nav class="site-nav" aria-label="Main">
        <a href="/#work">Work</a>
        <a href="/#how">How I work</a>
        <a href="/#outside">Outside work</a>
        <a href="/#contact">Contact</a>
      </nav>
      <div class="header-right">
        <a href="https://www.linkedin.com/in/jameschealey/" target="_blank" rel="noreferrer">LinkedIn <svg class="arrow" viewBox="0 0 12 12"><path d="M2 10L10 2M4 2h6v6"/></svg></a>
      </div>
    </div>
  </header>

  <main style="--c: var({color})">
    <section class="cs-hero">
      <div class="wrap">
        <a class="meta back" href="/#work">&larr; All work</a>
        <h1>{title}</h1>
        <p class="lede">{lede}</p>
{graphic_block}
{metrics_block}
      </div>
    </section>

    <div class="wrap cs-layout">
      <article class="cs-body">
{body}
        <div class="aside"><span></span><p>{aside} I'm happy to go deeper on the approach in conversation.</p></div>
      </article>
    </div>

    <div class="wrap">
      <nav class="cs-next" aria-label="More case studies">
        <a href="{prev_href}"><span class="meta">&larr; Previous</span><span class="title">{prev_title}</span></a>
        <a href="{next_href}"><span class="meta">Next &rarr;</span><span class="title">{next_title}</span></a>
      </nav>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap meta">
      <span>&copy; 2026 James Healey</span>
      <span><a href="/">Home</a> &nbsp;/&nbsp; <a href="https://www.linkedin.com/in/jameschealey/" target="_blank" rel="noreferrer">LinkedIn</a></span>
    </div>
  </footer>

  <button class="to-top" type="button" aria-label="Back to top"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg></button>
  <script src="site.js"></script>{scripts_extra}
</body>
</html>
'''

T = {'eu': 'Bringing a safety platform to Europe', 'sim': 'Simulating the safety system in 3D', 'embedded': 'Re-platforming a floor safety system', 'heal': 'Teaching a device fleet to fix itself', 'rollout': 'Retrofitting a live robotics network'}
F = {'eu': 'case-study-eu-pilot.html', 'sim': 'case-study-safety-simulation.html', 'embedded': 'case-study-embedded-platform.html', 'heal': 'case-study-self-healing.html', 'rollout': 'case-study-global-rollout.html'}

ICONS = {
    'dollar': '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.3c-.5-.9-1.4-1.4-2.5-1.4-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2.1-.6-2.5-1.5M12 6.3v1.6M12 16v1.7"/>',
    'pin': '<path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
    'team': '<circle cx="9" cy="8.5" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M15.5 14.3c2.8.1 5 1.7 5 4.7"/>',
    'layers': '<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/><path d="M3.5 12.5l8.5 4.5 8.5-4.5M3.5 16.5l8.5 4.5 8.5-4.5"/>',
    'device': '<rect x="7" y="3" width="10" height="18" rx="3"/><circle cx="12" cy="8" r="1.6"/><path d="M10 15h4"/>',
    'box': '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v8.5"/>',
    'shield': '<path d="M12 3l7 3v5.5c0 4.6-3.2 8-7 9.5-3.8-1.5-7-4.9-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.8 2.8 15.2 0 18M12 3c-2.8 2.8-2.8 15.2 0 18"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.3 2"/>',
    'robot': '<rect x="4.5" y="8" width="15" height="11" rx="2.5"/><path d="M12 4.5V8"/><circle cx="12" cy="4" r="1"/><circle cx="9.3" cy="13.2" r="1.3"/><circle cx="14.7" cy="13.2" r="1.3"/>',
    'calendar': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    'down': '<path d="M3.5 7l6 6 4-4 7 7"/><path d="M20.5 11v5h-5"/>',
    'cube': '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
}


def count(n, pre='', suf=''):
    shown = pre + format(n, ',') + suf
    return '<span data-count="%s" data-prefix="%s" data-suffix="%s">%s</span>' % (n, pre, suf, shown)


def metrics(items):
    out = []
    for i, (icon, value, label) in enumerate(items):
        out.append('          <div class="metric reveal" style="--i:%d"><span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">%s</svg></span>'
                   '<span class="val">%s</span><span class="lbl">%s</span></div>' % (i, ICONS[icon], value, label))
    return '        <div class="metrics">\n' + '\n'.join(out) + '\n        </div>'



pages = {
    'eu': dict(
        metrics=[('pin', count(52), 'buildings in the rollout'), ('calendar', '2027', 'rollout'), ('down', 'Lowest', 'fault and e-stop rates in the fleet'), ('shield', 'SIL 2', 'HFT 1')],
        color='--c-eu', graphic='gate',
        desc='How I led the pilots that brought an automated gate access safety platform to Europe.',
        lede='An automated gate access system controls how people get into the areas where robots work. I led the onsite pilots in Germany that brought it to Europe.',
        aside='Building names and the details of the gate system are left out on purpose.',
        prev='sim', next='embedded',
        body='''        <h2>The situation</h2>
        <p>The gate access system sits at the entrances to areas where robots are working. It manages how people get in and out, making sure the safety systems are working properly before a person enters a live robotic workspace.</p>

        <h2>What I did</h2>
        <p>I led the onsite pilots in Germany. I defined the test plans and the integration plans for the pilot buildings, covering how the gates would be tested and how they would fit into each building.</p>

        <h2>What happened</h2>
        <p>The pilot buildings ended up with the lowest fault and emergency stop rates in the global fleet. That result opened the way to roll the platform out to 52 European buildings in 2027.</p>'''),
    'sim': dict(
        metrics=[('pin', count(80), 'buildings'), ('globe', 'NA', 'North America'), ('cube', '3D', 'built with Three.js')],
        color='--c-indigo', graphic='sim',
        desc='A Three.js simulation that shows how a robotics safety system works in action.',
        lede='A safety system mostly does its job by making sure nothing happens, which makes it hard to explain. I used Three.js to build a simulation that shows how the system works in action, modeled on 80 buildings in North America. You can try a simplified version of it below.',
        aside='The original simulation and the details of the real safety system are left out on purpose.',
        prev='rollout', next='eu',
        graphic_block='''        <div class="cs-graphic sim3d reveal">
          <div class="sim-fallback" data-graphic="sim"></div>
          <canvas aria-label="3D simulation of robots slowing down and stopping as a person gets close"></canvas>
          <div class="floor-bar"><span>Click the floor to move the person. Drag to look around.</span><span>Slowed <b class="amber" data-slowed>0</b> &nbsp; Stopped <b data-stopped>0</b></span></div>
        </div>''',
        head_extra='''
  <script type="importmap">{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script>''',
        scripts_extra='''
  <script type="module" src="sim.js"></script>''',
        body='''        <h2>What I built</h2>
        <p>A 3D simulation of a robotic floor. You can watch how the safety system responds as people and robots move through the same space, which is hard to picture from slides and specs.</p>

        <h2>Why it matters</h2>
        <p>When everyone can watch the system work, there's far less room for misunderstanding. Design reviews move faster, the engineering work that follows moves faster, and the team comes to a shared understanding of the objective sooner.</p>

        <h2>Try the simplified version</h2>
        <p>The simulation at the top of this page is a small recreation I built for this website, not the original. Robots drive around a grid carrying shelves. The person has two zones around them. A robot inside the outer zone slows down and shows an amber light. A robot inside the inner zone stops, turns red and waits until the person moves away. The person can't walk through robots, so they have to go around them.</p>
        <ul>
          <li><strong>Click the floor</strong> to send the person somewhere.</li>
          <li><strong>Drag</strong> to orbit the camera around the floor.</li>
          <li>The counter in the corner shows how many robots are slowed and stopped at any moment.</li>
        </ul>'''),
    'embedded': dict(
        metrics=[('device', count(30000), 'devices'), ('dollar', count(57, '$', 'M'), 'projected savings'), ('shield', 'SIL 2', 'HFT 1'), ('globe', count(4, '', ' regions'), 'NA, EU, JP, AU')],
        color='--c-slate', graphic='platform',
        desc='How I built the business case and requirements to re-platform an embedded floor safety system.',
        lede='Robotic floors have a safety system built into them that helps keep people and moving robots apart. I wrote the business case and requirements for moving that system onto a new embedded platform.',
        aside='Specific designs, suppliers and internal numbers are left out on purpose.',
        prev='eu', next='heal',
        body='''        <h2>The situation</h2>
        <p>The floor safety system runs on embedded controllers across a large network of buildings. Changing it touches hardware, firmware, the crews who commission it and the people who work next to it every day.</p>
        <p>I already knew the system well. Before moving into product, I ran the retrofit to move roughly 240 buildings to its current generation, working with about 16 engineering groups to get it done.</p>

        <h2>What I did</h2>
        <p>I put together the business case, the financial model and the product requirements. The case rested on four cost drivers:</p>
        <ul>
          <li><strong>Hardware cost.</strong> What each unit costs to build, and where a new platform could bring that down.</li>
          <li><strong>Cybersecurity.</strong> What it takes to keep the system secure over its life.</li>
          <li><strong>Commissioning labor.</strong> How much time crews spend bringing the system up in a building.</li>
          <li><strong>User experience.</strong> What the system is like for the people who install, maintain and work around it.</li>
        </ul>
        <p>From there I wrote the requirements and brought the plan into annual planning.</p>

        <h2>Where it's headed</h2>
        <p>The program will drive $57M in cost reduction, and it's being developed for integration into next-generation robotic programs in 2027 and 2028.</p>'''),
    'heal': dict(
        metrics=[('device', count(15000), 'devices'), ('dollar', count(8, '~$', 'M'), 'in value'), ('shield', 'SIL 2', 'HFT 1'), ('globe', count(4, '', ' regions'), 'NA, EU, JP, AU')],
        color='--c-red', graphic='heal',
        desc='How I shipped automated recovery from communication losses across a fleet of 15,000 wearable safety devices.',
        lede='People working near robots wear radio-based safety devices. When one of those devices lost communication, the safety system stopped robotic operations until someone reset it by hand. I worked with firmware and wireless engineers to make that recovery automatic.',
        aside='Technical details of the devices, the wireless system and the recovery logic are left out on purpose.',
        prev='embedded', next='rollout',
        body='''        <h2>The situation</h2>
        <p>The wearable device stays in constant communication with the safety system. When that communication drops, the system does the safe thing and stops robotic operations.</p>
        <p>Before this program, getting operations running again after a dropout required a manual reset. That kept robots stopped for much longer than the dropout itself.</p>

        <h2>What I did</h2>
        <p>I owned the program on the product side and worked closely with the firmware and wireless engineering teams who built the recovery mechanism. When communication drops now, the system pauses operations for a short time to let the connection restore. Once it's back, robotic operations resume on their own, with no human intervention.</p>
        <p>We shipped it across the whole fleet of 15,000 devices.</p>

        <h2>What happened</h2>
        <p>Short communication losses no longer turn into long stoppages waiting for a manual reset. Automated recovery unlocked about $8M in value.</p>

        <h2>A related project</h2>
        <p>Around the same time, I reviewed the spare parts kits we send to new buildings against expected failure rates, and helped build fault analysis tooling so field teams can replace parts before they fail. That cut launch spare and consumable costs by about 70%, or $2M over three years.</p>'''),
    'rollout': dict(
        metrics=[('pin', count(300), 'buildings'), ('dollar', count(62, '$', 'M'), 'in value'), ('shield', 'SIL 2', 'HFT 1'), ('globe', count(4, '', ' regions'), 'NA, EU, JP, AU')],
        color='--c-steel', graphic='network',
        desc='How I ran hardware and safety retrofits across 300 live robotics buildings.',
        lede='Before I moved into product, I ran retrofits: hardware, firmware and safety changes to robotics buildings that were already up and running. The work had to fit into short maintenance windows at buildings all over the world.',
        aside='Building names, equipment models and internal program names are left out on purpose.',
        prev='heal', next='sim',
        body='''        <h2>The situation</h2>
        <p>A retrofit means changing equipment in a building that's in the middle of running. You get a narrow downtime window, a crew that may be seeing the work for the first time, and station setups that don't always match the drawings. Engineering, safety, operations and supply chain all need to agree on what "done" looks like.</p>

        <h2>What I ran</h2>
        <p>Together, these retrofits delivered $62M in value.</p>
        <ul>
          <li><strong>A global retrofit of the wearable safety fleet.</strong> This delivered about $50M in savings over three years. At several buildings in Japan the retrofit depended on upgrading the main safety controller inside a two-hour downtime window, so I did those upgrades myself.</li>
          <li><strong>Robotic workcell fixes.</strong> Anchoring and joint retrofits worth more than $5M in savings, plus fixes for pinch points, machine guarding and fire risk that avoided a little over $1M in costs.</li>
          <li><strong>A robot firmware update across about 30 buildings with robotic workcells.</strong> It added remote interface features and removed the need for vendor service visits, worth about $5M.</li>
          <li><strong>A networking security program</strong> that covered hundreds of thousands of mobile robots and crossed several organizations.</li>
        </ul>
        <p>On the smaller retrofits I usually managed third-party technician crews directly, often several two-person teams at once. On two of them we closed a safety risk at more than 30 buildings in about a month once parts arrived.</p>

        <h2>What I changed along the way</h2>
        <p>A lot of the value came from fixing how retrofits were run, so the next one went better:</p>
        <ul>
          <li><strong>Measuring the value.</strong> When I started, nobody tracked what safety retrofits were worth. I worked with safety engineering to define the turnover, labor and liability costs tied to them. That data provided quantitative evidence to keep investing in the team.</li>
          <li><strong>A golden asset.</strong> Before a crew moves on to the rest of a building, the first completed unit gets checked and signed off by everyone involved. It becomes the reference for what "good" looks like, which isn't always obvious with rotating teams of technicians and a wide variety of equipment configurations. This became standard practice for the team.</li>
          <li><strong>Technician debriefs before starting.</strong> A technical kickoff with every technician before the work begins. Also now standard.</li>
          <li><strong>Integration testing for real buildings.</strong> Station setups varied more in the field than on paper, so we added integration testing to catch surprises before the maintenance window.</li>
          <li><strong>Less paperwork.</strong> I moved all retrofit documents into one place and made a standard set of templates, covering the schedule, overview, change management, risks and cost tracking.</li>
        </ul>'''),
}

for k, p in pages.items():
    out = HEAD.format(
        title=T[k], prev_href=F[p['prev']], prev_title=T[p['prev']],
        next_href=F[p['next']], next_title=T[p['next']],
        graphic_block=p.get('graphic_block', '        <div class="cs-graphic reveal" data-graphic="%s"></div>' % p['graphic']),
        head_extra=p.get('head_extra', ''), scripts_extra=p.get('scripts_extra', ''),
        metrics_block=metrics(p['metrics']),
        **{x: p[x] for x in ['color', 'desc', 'lede', 'aside', 'body']})
    with open(F[k], 'w', encoding='utf-8') as f:
        f.write(out)
print('ok')
