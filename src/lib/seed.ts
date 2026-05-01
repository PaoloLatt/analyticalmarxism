import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config({ path: '.env' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

async function upsertThinker(data: Record<string, unknown>) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('Thinker')
    .upsert({ ...data, updatedAt: now }, { onConflict: 'slug' });
  if (error) throw new Error(`Thinker upsert failed: ${error.message}`);
  const { data: row } = await supabase
    .from('Thinker')
    .select('id')
    .eq('slug', data.slug as string)
    .single();
  return row as { id: string };
}

async function upsertPost(data: Record<string, unknown>) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('Post')
    .upsert({ ...data, updatedAt: now }, { onConflict: 'slug' });
  if (error) throw new Error(`Post upsert failed: ${error.message}`);
}

async function upsertInfographic(data: Record<string, unknown>) {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('Infographic')
    .upsert({ ...data, updatedAt: now }, { onConflict: 'slug' });
  if (error) throw new Error(`Infographic upsert failed: ${error.message}`);
}

async function main() {
  console.log('🌱 Seeding database...');
  const now = new Date().toISOString();

  // ─── Thinkers ──────────────────────────────────────────
  const cohen = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'ga-cohen',
    name: 'G.A. Cohen',
    birthYear: 1941,
    deathYear: 2009,
    nationality: 'Canadian',
    shortBio: 'Chichele Professor of Social and Political Theory at Oxford. Defended a rigorous reconstruction of historical materialism and became a leading critic of Rawlsian liberalism from the left.',
    fullBio: `Gerald Allan Cohen was born in Montreal to Communist Jewish parents and studied at McGill and Oxford. His 1978 book *Karl Marx's Theory of History: A Defence* is widely regarded as the founding text of Analytical Marxism.\n\nCohen argued that Marx's theory of history could be reconstructed as a series of functional explanations: the relations of production are explained by their tendency to promote the development of productive forces. This was a bold claim — it meant historical materialism could be stated with philosophical precision and tested against evidence.\n\nIn his later career, Cohen turned to political philosophy, arguing in *Why Not Socialism?* and *Rescuing Justice and Equality* that a just society requires not only fair institutions but also an egalitarian ethos among its members. His critique of Rawls — that justice requires more than institutional design — remains deeply influential.`,
    contribution: "Reconstructed Marx's theory of history using the tools of analytic philosophy, demonstrating that historical materialism can be formulated as a rigorous set of functional explanations. Later developed a powerful egalitarian critique of liberal political philosophy.",
    keyWorks: JSON.stringify([
      { title: "Karl Marx's Theory of History: A Defence", year: 1978, description: "The founding text of Analytical Marxism — a rigorous philosophical reconstruction of historical materialism using functional explanation." },
      { title: "History, Labour, and Freedom", year: 1988, description: "Collected essays deepening and defending the arguments of the 1978 book." },
      { title: "Self-Ownership, Freedom, and Equality", year: 1995, description: "A sustained critique of right-libertarianism and the concept of self-ownership." },
      { title: "Rescuing Justice and Equality", year: 2008, description: "Argues that Rawlsian justice is insufficient — genuine equality requires a community ethos, not just fair institutions." },
      { title: "Why Not Socialism?", year: 2009, description: "A short, accessible argument that the values of a camping trip — equality, community, reciprocity — should govern society at large." },
    ]),
    published: true,
    createdAt: now,
  });

  const elster = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'jon-elster',
    name: 'Jon Elster',
    birthYear: 1940,
    nationality: 'Norwegian',
    shortBio: 'Political theorist and philosopher of social science at Columbia. Advocated for methodological individualism and the use of game theory and rational choice within Marxist analysis.',
    fullBio: `Jon Elster is a Norwegian political theorist who has held positions at the University of Oslo, the University of Chicago, the Collège de France, and Columbia University. He is one of the most prolific social scientists of his generation.\n\nElster's contribution to Analytical Marxism centered on his insistence on *microfoundations*: the idea that all social explanations must ultimately be grounded in the actions and motivations of individuals. He was sharply critical of what he called "functional explanation" in Marxism — the claim that social phenomena exist because of their beneficial consequences — unless a causal mechanism could be specified.\n\nHis book *Making Sense of Marx* (1985) is both a sympathetic engagement with and an internal critique of Marx's work. Elster found much of value in Marx's analysis of ideology and exploitation but rejected the teleological elements of historical materialism.\n\nBeyond Marxism, Elster has written extensively on rationality, emotions, constitutionalism, and transitional justice.`,
    contribution: "Insisted that Marxist social theory must provide microfoundations — causal mechanisms at the individual level. Brought game theory and rational choice theory into dialogue with Marxism, while critically scrutinizing Marx's own use of functional explanation.",
    keyWorks: JSON.stringify([
      { title: "Logic and Society", year: 1978, description: "Early work applying rational choice and game theory to social and political analysis." },
      { title: "Ulysses and the Sirens", year: 1979, description: "Studies of rationality, precommitment, and the ways agents bind themselves to overcome weakness of will." },
      { title: "Making Sense of Marx", year: 1985, description: "A comprehensive analytical reconstruction and critique of Marx — salvaging insights while rejecting teleology." },
      { title: "Nuts and Bolts for the Social Sciences", year: 1989, description: "An accessible introduction to mechanism-based social science explanation." },
    ]),
    published: true,
    createdAt: now,
  });

  const roemer = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'john-roemer',
    name: 'John Roemer',
    birthYear: 1945,
    nationality: 'American',
    shortBio: 'Economist and political scientist at Yale. Developed a game-theoretic and property-rights-based theory of exploitation independent of the labor theory of value.',
    fullBio: `John Roemer is an American economist who has taught at UC Davis and Yale University. Trained in mathematical economics, he brought formal modeling to questions that Marxists had previously addressed through dialectical reasoning.\n\nRoemer's most significant contribution was his reformulation of exploitation theory. In *A General Theory of Exploitation and Class* (1982), he showed that exploitation can be defined without reference to the labor theory of value. Instead, exploitation arises from unequal ownership of productive assets: a person is exploited if they would be better off under an equal distribution of assets. This "property relations" definition unifies Marxist exploitation with feudal and other forms.\n\nRoemer also made important contributions to the theory of equality of opportunity and to "market socialism" — arguing that socialist goals could be achieved through market mechanisms combined with redistributive ownership of capital.`,
    contribution: 'Reformulated Marxist exploitation theory using game theory and general equilibrium — showing that exploitation derives from unequal property ownership, not from the labor theory of value. Developed models of market socialism.',
    keyWorks: JSON.stringify([
      { title: "A General Theory of Exploitation and Class", year: 1982, description: "Formalizes exploitation through property relations and game-theoretic models, bypassing the labor theory of value." },
      { title: "Free to Lose", year: 1988, description: "An accessible introduction to the analytical Marxist approach to exploitation and class." },
      { title: "A Future for Socialism", year: 1994, description: "Proposes coupon-based market socialism as a feasible alternative to both capitalism and central planning." },
      { title: "Equality of Opportunity", year: 1998, description: "A formal theory of equality of opportunity that distinguishes circumstances from effort." },
    ]),
    published: true,
    createdAt: now,
  });

  const wright = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'erik-olin-wright',
    name: 'Erik Olin Wright',
    birthYear: 1947,
    deathYear: 2019,
    nationality: 'American',
    shortBio: 'Sociologist at the University of Wisconsin-Madison. Developed the most influential neo-Marxist theory of class structure and later championed the "Real Utopias" project.',
    fullBio: `Erik Olin Wright was an American sociologist whose career was devoted to two interconnected projects: making Marxist class analysis empirically rigorous, and envisioning realistic institutional alternatives to capitalism.\n\nHis class theory addressed the problem of "contradictory class locations" — the fact that many people in advanced capitalism (managers, professionals, small employers) don't fit neatly into the bourgeoisie or proletariat. Wright developed a multi-dimensional framework based on ownership of capital assets, control over organizational assets, and possession of skill/credential assets.\n\nIn his later career, Wright launched the "Real Utopias Project," which examined actually existing institutions — cooperatives, participatory budgeting, universal basic income, Wikipedia — as embryonic forms of a democratic-egalitarian alternative to capitalism. His final book, *How to Be an Anticapitalist in the Twenty-First Century* (2019), distilled these ideas into an accessible manifesto.`,
    contribution: 'Created the most sophisticated neo-Marxist class typology, accounting for contradictory class locations in advanced capitalism. Founded the "Real Utopias Project," examining practical institutional alternatives to capitalism.',
    keyWorks: JSON.stringify([
      { title: "Classes", year: 1985, description: "Presents the multi-dimensional framework for class analysis with contradictory class locations." },
      { title: "Class Counts", year: 1997, description: "Comparative empirical analysis of class structure across multiple countries using survey data." },
      { title: "Envisioning Real Utopias", year: 2010, description: "The theoretical framework for the Real Utopias Project — emancipatory alternatives grounded in existing institutions." },
      { title: "How to Be an Anticapitalist in the Twenty-First Century", year: 2019, description: "Accessible final statement outlining strategies of taming, dismantling, escaping, and eroding capitalism." },
    ]),
    published: true,
    createdAt: now,
  });

  const vanParijs = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'philippe-van-parijs',
    name: 'Philippe Van Parijs',
    birthYear: 1951,
    nationality: 'Belgian',
    shortBio: 'Philosopher and political economist at UCLouvain. Leading theorist of universal basic income as a requirement of "real freedom for all."',
    fullBio: `Philippe Van Parijs is a Belgian political philosopher who has taught at UCLouvain, Harvard, and Oxford. While connected to the Analytical Marxist tradition, his work has evolved into a broader left-libertarian political philosophy.\n\nVan Parijs is best known for his defense of an unconditional basic income — a regular cash payment to every member of society, regardless of employment status or willingness to work. In *Real Freedom for All* (1995), he argues that genuine freedom requires not merely formal rights but real capacity to choose among life options. A basic income, funded by taxation of external resources, is the institutional mechanism for maximizing real freedom.`,
    contribution: 'Developed the philosophical case for universal basic income as a matter of "real freedom" — arguing that genuine liberty requires not just formal rights but the material means to exercise them. Bridged analytical Marxism with liberal egalitarianism.',
    keyWorks: JSON.stringify([
      { title: "Real Freedom for All", year: 1995, description: "The foundational philosophical defense of unconditional basic income as the requirement of real-libertarianism." },
      { title: "What's Wrong with a Free Lunch?", year: 2001, description: "Accessible argument for UBI with responses from critics including Herbert Simon and Edmund Phelps." },
      { title: "Basic Income: A Radical Proposal for a Free Society and a Sane Economy", year: 2017, description: "Co-authored with Yannick Vanderborght — a comprehensive case for UBI spanning philosophy, economics, and policy." },
    ]),
    published: true,
    createdAt: now,
  });

  const przeworski = await upsertThinker({
    id: crypto.randomUUID(),
    slug: 'adam-przeworski',
    name: 'Adam Przeworski',
    birthYear: 1940,
    nationality: 'Polish-American',
    shortBio: 'Political scientist at NYU. Applied game theory and rational choice to questions about democracy, capitalism, and the strategic dilemmas of socialist politics.',
    fullBio: `Adam Przeworski is a Polish-American political scientist who has held positions at the University of Chicago and New York University. His work sits at the intersection of comparative politics, political economy, and democratic theory.\n\nPrzeworski's key contribution to Analytical Marxism was his game-theoretic analysis of the strategic dilemmas facing socialist parties in capitalist democracies. In *Capitalism and Social Democracy* (1985), he showed that workers' parties face a structural tension: to win elections they must appeal beyond the working class, but in doing so they dilute their transformative program. This "electoral dilemma" helps explain the trajectory of European social democracy.`,
    contribution: "Used game theory to analyze the strategic dilemmas of socialist politics in capitalist democracies — showing why workers' parties face structural pressure to moderate. Extended this approach to the study of democratic transitions and consolidation.",
    keyWorks: JSON.stringify([
      { title: "Capitalism and Social Democracy", year: 1985, description: "Game-theoretic analysis of the electoral dilemma facing socialist parties in democratic capitalism." },
      { title: "Democracy and the Market", year: 1991, description: "Analyzes transitions from authoritarian rule and the relationship between economic and political reform." },
      { title: "Crises of Democracy", year: 2019, description: "Examines threats to democratic institutions from inequality, partisan polarization, and declining trust." },
    ]),
    published: true,
    createdAt: now,
  });

  console.log('  ✓ Thinkers seeded');

  // ─── Blog Posts ────────────────────────────────────────
  await upsertPost({
    id: crypto.randomUUID(),
    slug: 'what-is-analytical-marxism',
    title: 'What Is Analytical Marxism?',
    excerpt: 'An introduction to the intellectual movement that brought analytic philosophy, game theory, and rigorous social science to bear on Marxist questions — and why it still matters.',
    content: `## The September Group\n\nIn September 1979, a group of philosophers, economists, and social scientists met for the first time in London. They shared a conviction: that the core questions of Marxism — about exploitation, class, history, and justice — deserved to be addressed with the same rigor and clarity demanded in the best analytic philosophy and social science.\n\nThe group included G.A. Cohen, Jon Elster, John Roemer, Erik Olin Wright, Philippe Van Parijs, and Adam Przeworski, among others. They continued meeting annually for decades, and their collective work became known as **Analytical Marxism** — or, in their own irreverent self-description, "Non-Bullshit Marxism."\n\n## Core Commitments\n\nWhat united these thinkers was not a shared political program but a set of methodological commitments:\n\n1. **Clarity of argument.** Claims should be stated precisely enough to be evaluated and, where possible, formally modeled.\n2. **Methodological individualism.** Social phenomena should be explained through the actions and interactions of individuals — not through appeals to supra-individual entities like "History" or "Capital."\n3. **Engagement with mainstream social science.** Marxist arguments should be tested using the tools of economics, game theory, and empirical sociology, not insulated from criticism.\n4. **Normative seriousness.** Questions of justice, freedom, and exploitation require explicit normative argument, not hand-waving appeals to historical inevitability.\n\n## Why It Matters Today\n\nAnalytical Marxism demonstrated that taking Marx seriously and thinking clearly are not in tension — they reinforce each other. In an era of rising inequality, platform capitalism, and debates over automation and UBI, the tools and questions of this tradition remain urgently relevant.`,
    category: 'explainer',
    difficulty: 'introductory',
    published: true,
    featured: true,
    authorId: null,
    createdAt: now,
  });

  await upsertPost({
    id: crypto.randomUUID(),
    slug: 'exploitation-without-labor-theory-of-value',
    title: 'Exploitation Without the Labor Theory of Value',
    excerpt: "John Roemer showed that Marxist exploitation theory doesn't need the labor theory of value. Here's how his property-relations approach works — and why it was revolutionary.",
    content: `## The Problem\n\nMarx's theory of exploitation rests on the labor theory of value: workers produce more value than they receive in wages, and the surplus is appropriated by capitalists. But the labor theory of value has well-known problems — it struggles with heterogeneous labor, joint production, and the transformation problem.\n\nDoes abandoning the labor theory of value mean abandoning the concept of exploitation? John Roemer's answer: absolutely not.\n\n## Roemer's Game-Theoretic Approach\n\nIn *A General Theory of Exploitation and Class* (1982), Roemer defined exploitation through a thought experiment. Consider a coalition of agents in an economy. That coalition is **exploited** if its members would be better off by withdrawing from the economy with their per capita share of society's productive assets.\n\nThe intuition is simple: exploitation exists when some people benefit from an unequal distribution of productive property. You don't need to calculate labor values — you just need to ask whether the current distribution of assets is making some people worse off than they would be under equal ownership.\n\n## Implications\n\nRoemer's approach makes exploitation theory more rigorous and less vulnerable to the technical criticisms of the labor theory of value. It shows that exploitation is fundamentally about unjust property relations, not about a metaphysical substance called "value."`,
    category: 'explainer',
    difficulty: 'intermediate',
    published: true,
    featured: false,
    authorId: roemer.id,
    createdAt: now,
  });

  await upsertPost({
    id: crypto.randomUUID(),
    slug: 'ai-automation-and-wrights-real-utopias',
    title: "AI, Automation, and Wright's Real Utopias",
    excerpt: 'Erik Olin Wright\'s framework of "eroding capitalism" through real utopian institutions offers a surprisingly useful lens for thinking about AI and the future of work.',
    content: `## The Automation Anxiety\n\nThe rapid development of AI and automation technologies has revived old questions: Will machines replace workers? Will inequality deepen? What institutions can protect people in a world of diminishing labor demand?\n\nThese are precisely the questions that Erik Olin Wright's "Real Utopias" framework was designed to address — not through grand revolutionary blueprints, but through the patient construction of institutional alternatives.\n\n## Wright's Four Strategies\n\nIn *How to Be an Anticapitalist in the Twenty-First Century*, Wright outlined four strategic orientations toward capitalism:\n\n1. **Smashing capitalism** — revolutionary overthrow.\n2. **Taming capitalism** — social-democratic regulation.\n3. **Escaping capitalism** — building alternative communities outside the system.\n4. **Eroding capitalism** — building alternative institutions *within* capitalism that gradually expand the scope of democratic, egalitarian economic organization.\n\nWright advocated for a combination of taming and eroding — using the state to create space for cooperative and democratic institutions to grow.\n\n## The Real Utopia of AI\n\nWright would likely have seen AI as a double-edged sword — a technology that could either intensify exploitation or, within the right institutions, expand the realm of real freedom. The question is not whether automation is good or bad, but who owns and controls it.`,
    category: 'commentary',
    difficulty: 'introductory',
    published: true,
    featured: true,
    authorId: wright.id,
    createdAt: now,
  });

  await upsertPost({
    id: crypto.randomUUID(),
    slug: 'reading-cohens-karl-marxs-theory-of-history',
    title: "Reading Cohen's Karl Marx's Theory of History",
    excerpt: "A guided walkthrough of the book that launched Analytical Marxism — G.A. Cohen's rigorous philosophical reconstruction of historical materialism.",
    content: `## Why This Book Matters\n\nPublished in 1978, *Karl Marx's Theory of History: A Defence* (KMTH) is the founding text of Analytical Marxism. Cohen set himself an ambitious task: to state Marx's theory of history with enough precision that it could be properly evaluated — defended where defensible, and rejected where not.\n\n## The Core Argument\n\nCohen's reconstruction of historical materialism rests on two central theses:\n\n**The Development Thesis:** The productive forces (technology, skills, knowledge) tend to develop throughout history.\n\n**The Primacy Thesis:** The nature of the production relations (property relations, class structure) is explained by the level of development of the productive forces.\n\nThe second thesis is the controversial one. Cohen argues that it involves *functional explanation*: the relations of production are as they are *because* they are optimal for the development of the productive forces at a given stage.\n\n## How to Read It\n\nThe book rewards careful, chapter-by-chapter reading. Start with the Preface for Cohen's intellectual autobiography, then work through Part I (chapters 1–6) for the core reconstruction. The expanded edition (2000) includes valuable additional essays responding to critics.`,
    category: 'reading',
    difficulty: 'intermediate',
    published: true,
    featured: false,
    authorId: cohen.id,
    createdAt: now,
  });

  console.log('  ✓ Posts seeded');

  // ─── Infographics ──────────────────────────────────────
  await upsertInfographic({
    id: crypto.randomUUID(),
    slug: 'september-group-timeline',
    title: 'The September Group: A Timeline',
    description: 'From the first meeting in 1979 to the key publications that defined Analytical Marxism — a visual timeline of the movement.',
    type: 'infographic',
    published: true,
    featured: true,
    createdAt: now,
  });

  await upsertInfographic({
    id: crypto.randomUUID(),
    slug: 'roemers-exploitation-game',
    title: "Roemer's Exploitation Game",
    description: "A visual breakdown of Roemer's game-theoretic model of exploitation — showing how unequal asset ownership generates exploitation without labor values.",
    type: 'diagram',
    published: true,
    thinkerId: roemer.id,
    createdAt: now,
  });

  await upsertInfographic({
    id: crypto.randomUUID(),
    slug: 'wrights-class-typology',
    title: "Wright's Class Typology",
    description: "A diagram of Erik Olin Wright's multi-dimensional class map — capital assets, organizational assets, and skill assets creating contradictory class locations.",
    type: 'diagram',
    published: true,
    thinkerId: wright.id,
    createdAt: now,
  });

  console.log('  ✓ Infographics seeded');

  // ─── Resources ─────────────────────────────────────────
  const resources = [
    { title: "Karl Marx's Theory of History: A Defence", description: "Cohen's founding text — start here for the philosophical foundations.", type: 'book', difficulty: 'intermediate' },
    { title: "Making Sense of Marx", description: "Elster's comprehensive analytical engagement with Marx's entire body of work.", type: 'book', difficulty: 'advanced' },
    { title: "A General Theory of Exploitation and Class", description: "Roemer's game-theoretic reformulation of exploitation theory.", type: 'book', difficulty: 'advanced' },
    { title: "Why Not Socialism?", description: "Cohen's short, accessible argument for socialist values — the best starting point for beginners.", type: 'book', difficulty: 'introductory' },
    { title: "How to Be an Anticapitalist in the Twenty-First Century", description: "Wright's final book — a clear, practical guide to anti-capitalist strategy.", type: 'book', difficulty: 'introductory' },
    { title: "Nuts and Bolts for the Social Sciences", description: "Elster's accessible introduction to mechanism-based social science.", type: 'book', difficulty: 'introductory' },
    { title: "Analytical Marxism (ed. John Roemer)", description: "The definitive anthology — essays by all the major figures, with Roemer's excellent introduction.", type: 'book', difficulty: 'intermediate' },
    { title: "Real Freedom for All", description: "Van Parijs's philosophical case for unconditional basic income.", type: 'book', difficulty: 'intermediate' },
  ];

  for (const r of resources) {
    await supabase.from('Resource').insert({ id: crypto.randomUUID(), ...r, createdAt: now, updatedAt: now });
  }

  console.log('  ✓ Resources seeded');

  // ─── Glossary ──────────────────────────────────────────
  const glossaryTerms = [
    { term: 'Analytical Marxism', definition: 'An intellectual movement that applies the methods of analytic philosophy, formal modeling, and mainstream social science to Marxist questions about exploitation, class, history, and justice. Also known as "rational choice Marxism" or (self-deprecatingly) "Non-Bullshit Marxism."' },
    { term: 'Functional Explanation', definition: 'An explanation of a phenomenon by its consequences — e.g., "capitalist property relations exist because they promote the development of productive forces." Cohen argued this is legitimate if an underlying causal mechanism can be specified.' },
    { term: 'Methodological Individualism', definition: 'The principle that social phenomena should be explained in terms of the actions, interactions, and beliefs of individuals. Advocated by Elster as essential to rigorous social science; contested within broader Marxism.' },
    { term: 'Exploitation (Roemer)', definition: "A coalition of agents is exploited if its members would be better off by withdrawing from the economy with their per capita share of society's productive assets. This definition replaces the labor theory of value with a property-relations approach." },
    { term: 'Contradictory Class Locations', definition: "Wright's concept for positions in the class structure that share characteristics of multiple classes — e.g., managers who exercise authority (like capitalists) but sell their labor (like workers)." },
    { term: 'Real Freedom', definition: "Van Parijs's concept: genuine freedom requires not only formal rights (negative liberty) but the real capacity to choose among life options — which requires material resources. A universal basic income is the institutional means to maximize real freedom." },
    { term: 'Productive Forces', definition: "In Marx's theory, the technological and human capacities for producing goods — tools, machinery, skills, scientific knowledge. Cohen's Development Thesis holds that these tend to grow over time." },
    { term: 'Relations of Production', definition: "The social relationships that organize production — especially property relations and class structure. Cohen's Primacy Thesis holds that these are explained by the level of the productive forces." },
    { term: 'September Group', definition: 'The informal name for the group of Analytical Marxist scholars who met annually beginning in September 1979. Core members included Cohen, Elster, Roemer, Wright, Van Parijs, Przeworski, Robert Brenner, and others.' },
  ];

  for (const g of glossaryTerms) {
    await supabase.from('GlossaryTerm').upsert({ id: crypto.randomUUID(), ...g, createdAt: now, updatedAt: now }, { onConflict: 'term' });
  }

  console.log('  ✓ Glossary seeded');
  console.log('\n✅ Seed complete!');

  // suppress unused variable warnings
  void elster; void vanParijs; void przeworski;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
