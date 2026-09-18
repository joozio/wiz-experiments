'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// --- English dictionary (common 3-7 letter words) ---
const WORDS = new Set([
  // 3-letter
  'the','and','for','are','but','not','you','all','can','had','her','was','one','our','out',
  'day','get','has','him','his','how','its','may','new','now','old','see','way','who','boy',
  'did','end','got','let','put','say','she','too','use','dad','mom','run','big','dog','cat',
  'red','hot','top','set','sit','hit','bit','cut','eat','fly','pen','cup','hat','bed','box',
  'car','bus','sun','map','key','ice','egg','arm','leg','eye','ear','lip','toe','age','air',
  'art','bag','bar','bat','bay','bee','bet','bow','bug','cab','cap','cow','cry','dam','dew',
  'dip','dot','dry','dug','dye','elm','fan','fat','fig','fin','fit','fix','fog','fox','fun',
  'fur','gap','gas','gem','gin','gum','gun','gut','gym','ham','hen','hid','hog','hop','hub',
  'hug','hut','ink','inn','ion','ivy','jam','jar','jaw','jet','jig','job','jog','joy','jug',
  'kit','lab','lad','lap','law','lay','lid','lit','log','lot','low','mad','mat','mix','mob',
  'mod','mop','mud','mug','nap','net','nil','nod','nor','not','nut','oak','oar','oat','odd',
  'oil','opt','ore','owe','owl','own','pad','pan','pat','paw','pea','pet','pie','pig','pin',
  'pit','pod','pop','pot','pub','pug','pun','pup','rag','ram','ran','rap','rat','raw','ray',
  'ref','rib','rid','rig','rim','rip','rod','rot','row','rub','rug','rum','rut','rye','sap',
  'saw','sea','sew','shy','sin','sip','six','ski','sky','sly','sob','sod','son','sow','spa',
  'spy','sue','sum','tab','tag','tan','tap','tar','tax','tea','ten','tie','tin','tip','ton',
  'tow','toy','try','tub','tug','van','vat','vet','via','vow','wag','war','wax','web','wed',
  'wet','wig','win','wit','woe','wok','won','woo','wow','yak','yam','yap','yaw','yes','yet',
  'yew','yin','zip','zoo',
  // 4-letter
  'that','with','have','this','will','your','from','they','been','call','come','each','make',
  'like','long','look','many','some','time','very','when','word','also','back','give','most',
  'find','here','know','take','want','work','year','them','then','than','name','help','hand',
  'high','keep','last','life','live','love','move','much','must','next','only','open','over',
  'play','read','show','side','talk','tell','turn','used','walk','what','went','home','good',
  'part','just','even','said','into','more','down','over','such','well','about','made','after',
  'book','city','code','dark','data','deep','done','door','draw','drop','dust','earn','easy',
  'edge','evil','face','fact','fail','fair','fall','farm','fast','fate','fear','feel','fill',
  'film','fire','fish','flat','flow','folk','food','fool','form','free','fuel','full','game',
  'gate','gift','girl','glad','glow','goal','gold','gone','grab','gray','grew','grid','grin',
  'grip','grow','gulf','half','hall','hang','hard','harm','hate','heal','hear','heat','hero',
  'hide','hill','hold','hole','holy','hook','hope','host','hour','huge','hunt','hurt','icon',
  'idea','iron','isle','jail','join','joke','jump','jury','keen','kick','kind','king','kiss',
  'knee','knot','laid','lake','lamp','land','lane','late','lawn','lead','leaf','lean','left',
  'lend','lens','less','liar','lick','limb','lime','limp','line','link','lion','list','load',
  'loan','lock','lone','loop','lord','loss','lost','loud','luck','lump','lung','lure','lurk',
  'mail','main','mass','mate','maze','meal','mean','meat','meet','melt','memo','menu','mere',
  'mesh','mess','mild','mile','milk','mill','mind','mine','mint','miss','mock','mode','mood',
  'moon','moor','more','moss','muse','myth','nail','navy','neat','neck','need','news','nice',
  'nine','node','none','noon','norm','nose','note','noun','odds','once','onto','oral','oven',
  'pace','pack','page','paid','pain','pair','pale','palm','pane','park','part','pass','past',
  'path','peak','peel','peer','pile','pine','pink','pipe','plan','plot','plug','poem','poet',
  'pole','poll','pond','pool','poor','pope','pork','port','pose','post','pour','pray','prey',
  'prop','pull','pump','pure','push','quit','race','rack','rage','raid','rail','rain','rank',
  'rare','rate','rear','reef','rely','rent','rest','rice','rich','ride','ring','riot','rise',
  'risk','road','roam','rock','role','roll','roof','room','root','rope','rose','ruin','rule',
  'rush','rust','safe','sail','sake','sale','salt','same','sand','sang','save','seal','seed',
  'seek','self','sell','send','shed','ship','shop','shot','shut','sick','sign','silk','sing',
  'sink','site','size','skin','slam','slap','slim','slip','slot','slow','snap','snow','soap',
  'soar','sock','soft','soil','sole','song','sort','soul','spin','spot','star','stay','stem',
  'step','stir','stop','such','suit','sure','swim','tail','tale','tall','tank','tape','task',
  'taxi','team','tear','teen','tell','tend','tent','term','test','text','them','thin','tick',
  'tide','tidy','tile','till','tiny','tire','toll','tomb','tone','took','tool','tops','tore',
  'torn','toss','tour','town','trap','tray','tree','trim','trio','trip','true','tube','tuck',
  'tune','twin','type','ugly','unit','upon','urge','used','user','vale','vary','vast','veil',
  'vein','verb','vest','view','vine','void','volt','vote','wade','wage','wait','wake','walk',
  'wall','wand','ward','warm','warn','warp','wash','wave','weak','wear','weed','week','weep',
  'well','west','what','when','whom','wick','wide','wife','wild','will','wilt','wind','wine',
  'wing','wink','wipe','wire','wise','wish','with','wolf','wood','wool','word','wore','worm',
  'worn','wrap','writ','yard','yarn','yell','yoga','yolk','zero','zone',
  // 5-letter
  'about','after','again','being','below','black','board','bring','build','carry','catch',
  'cause','child','claim','class','clean','clear','climb','close','could','count','cover',
  'cross','dance','death','dream','drink','drive','earth','eight','empty','enemy','enjoy',
  'enter','equal','error','event','every','exact','exist','extra','faith','field','fight',
  'final','first','floor','focus','force','found','frame','fresh','front','fruit','glass',
  'grace','grand','grant','grass','great','green','group','guess','guide','happy','heart',
  'heavy','hence','horse','hotel','house','human','humor','hurry','ideal','image','index',
  'inner','input','issue','joint','judge','knife','knock','known','labor','large','later',
  'laugh','layer','learn','leave','level','light','limit','liver','local','loose','lower',
  'lucky','lunch','magic','major','maker','march','match','maybe','mayor','media','mercy',
  'metal','might','minor','minus','model','money','month','moral','motor','mount','mouse',
  'mouth','movie','music','night','noise','north','noted','novel','nurse','ocean','offer',
  'often','order','other','outer','owner','paint','panel','party','patch','peace','phase',
  'phone','photo','piano','piece','pilot','pitch','pixel','place','plain','plane','plant',
  'plate','plaza','plead','plus','point','pound','power','press','price','pride','prime',
  'print','prior','prize','proof','proud','prove','punch','queen','quest','queue','quick',
  'quiet','quite','quote','radar','radio','raise','range','rapid','ratio','reach','ready',
  'realm','rebel','reign','relax','reply','rider','right','river','robot','rocky','roman',
  'round','route','royal','rural','saint','salad','sauce','scale','scene','scope','score',
  'sense','serve','seven','shake','shall','shame','shape','share','sharp','shelf','shell',
  'shift','shine','shirt','shock','shoot','shore','short','shout','sight','since','sixth',
  'sixty','skill','sleep','slice','slide','smart','smell','smile','smoke','snake','solar',
  'solid','solve','sorry','sound','south','space','spare','speak','speed','spend','spine',
  'split','sport','spray','squad','stack','staff','stage','stake','stand','start','state',
  'steal','steam','steel','steep','stick','still','stock','stone','stood','store','storm',
  'story','strip','stuck','study','stuff','style','sugar','suite','super','surge','swear',
  'sweep','sweet','swift','swing','sword','table','taste','teach','thank','theme','thick',
  'thing','think','third','those','three','throw','tired','title','today','token','total',
  'touch','tough','tower','trace','track','trade','trail','train','trait','trash','treat',
  'trend','trial','tribe','trick','troop','truck','truly','trust','truth','tumor','twice',
  'twist','ultra','uncle','under','union','unity','until','upper','upset','urban','usage',
  'usual','valid','value','video','virus','visit','vital','vocal','voice','waste','watch',
  'water','weigh','weird','whale','wheat','wheel','where','which','while','white','whole',
  'whose','woman','woods','world','worry','worse','worst','worth','would','wound','write',
  'wrong','wrote','yield','young','youth',
  // 6-letter
  'accept','access','across','action','actual','advice','affect','afford','agency','almost',
  'amount','animal','annual','answer','anyway','appeal','appear','artist','attack','august',
  'author','banner','barely','battle','beauty','became','become','before','behind','belong',
  'beside','beyond','bitter','blanch','border','bottom','bounce','branch','breath','bridge',
  'bright','broken','budget','bundle','burden','bureau','button','cancel','carbon','career',
  'castle','caught','center','chance','change','charge','choice','choose','church','circle',
  'client','closer','coffee','column','combat','common','comply','copper','corner','costly',
  'cotton','county','couple','course','cousin','credit','crisis','custom','damage','danger',
  'dealer','debate','decade','decide','defeat','defend','define','degree','demand','denial',
  'depict','deploy','derive','desert','design','desire','detail','detect','device','dialog',
  'differ','direct','doctor','domain','double','dozens','driver','during','easily','eating',
  'editor','effect','effort','eighth','either','emerge','empire','enable','ending','energy',
  'engage','engine','enough','ensure','entire','entity','equity','escape','estate','ethnic',
  'evolve','exceed','except','excuse','expand','expect','expert','export','extend','extent',
  'fabric','fairly','fallen','family','famous','farmer','father','fellow','female','fierce',
  'figure','filing','finger','finish','fiscal','flavor','flight','flower','flying','follow',
  'forced','forest','forget','formal','format','former','foster','friend','frozen','future',
  'galaxy','garden','gather','gender','gentle','global','golden','govern','growth','guilty',
  'guitar','handle','happen','harbor','hardly','hatred','hazard','height','hidden','holder',
  'honest','horror','hungry','hunter','ignore','immune','impact','import','impose','income',
  'indeed','inform','injury','insert','inside','intact','intend','intent','invade','invest',
  'island','itself','jersey','jungle','junior','justly','kidney','knight','ladder','launch',
  'lawyer','layout','leader','league','legacy','lender','length','lesson','letter','linear',
  'linked','liquid','listen','little','living','lonely','lovely','mainly','manage','manner',
  'marble','margin','marine','market','master','matter','medium','member','memory','mental',
  'merely','method','middle','mighty','miller','minute','mirror','modify','moment','monkey',
  'mostly','mother','motion','murder','museum','mutual','myself','namely','narrow','nation',
  'nature','nearby','nearly','neatly','neural','nicely','nobody','normal','notice','notion',
  'number','object','obtain','occupy','offend','office','online','oppose','option','orange',
  'origin','outfit','output','oxygen','palace','parent','partly','patent','patrol','patron',
  'permit','person','phrase','planet','player','please','pledge','plenty','pocket','poetry',
  'poison','policy','portal','poster','potato','powder','praise','prayer','prefer','pretty',
  'prince','prison','profit','proper','prove','public','punish','purple','pursue','puzzle',
  'racial','radius','random','rarely','rather','rating','reader','recall','recent','record',
  'reduce','reform','regard','regime','region','reject','relate','relief','remain','remote',
  'remove','render','repair','repeat','report','rescue','resign','resist','resort','result',
  'retail','retain','retire','return','reveal','review','revolt','reward','rhythm','richly',
  'rising','robust','roller','sacred','safety','salary','sample','saving','scheme','school',
  'screen','script','search','season','second','secure','select','seller','senior','series',
  'server','settle','severe','shadow','shield','signed','silent','silver','simple','simply',
  'singer','sister','sketch','slight','slowly','smooth','social','solely','solemn','sought',
  'source','spirit','spread','spring','square','stable','strain','strand','stream','street',
  'strict','strike','string','stroke','strong','studio','submit','sudden','suffer','summer',
  'summit','supply','surely','survey','switch','symbol','system','tackle','talent','target',
  'temple','tender','terror','thanks','theory','thirty','though','thread','threat','thrive',
  'throne','timber','tissue','tongue','toward','travel','treaty','tribal','tunnel','twelve',
  'unfair','unique','united','unlike','update','useful','valley','varied','vendor','verbal',
  'verify','versus','victim','violet','virtue','vision','visual','volume','walker','wealth',
  'weekly','weight','window','winner','winter','wisdom','within','wonder','worker','worthy',
  'yellow',
  // 7-letter
  'ability','account','achieve','acquire','address','advance','adverse','already','analyst',
  'ancient','anxiety','anybody','anytime','applied','arrange','article','attempt','attract',
  'auction','average','barrier','battery','bearing','because','bedroom','believe','beneath',
  'benefit','besides','billion','bracket','brother','cabinet','capable','captain','capture',
  'careful','carrier','catalog','caution','central','century','certain','chamber','channel',
  'chapter','charity','charter','chicken','chronic','circuit','citizen','climate','closing',
  'cluster','coastal','collect','college','comfort','command','comment','company','compare',
  'compete','complex','concern','conduct','confirm','connect','consent','consist','contact',
  'contain','content','contest','context','control','convert','correct','council','counter',
  'country','courage','creator','credits','cricket','crucial','crystal','culture','current',
  'custody','customs','defense','deficit','deliver','density','deposit','designn','despite',
  'destroy','develop','devoted','digital','diploma','disable','discard','disease','dismiss',
  'display','dispute','distant','diverse','divided','divorce','doctors','donated','drawing',
  'earlier','eastern','economy','edition','educate','elderly','elegant','element','embrace',
  'emotion','emperor','enhance','episode','essence','examine','example','excited','exclude',
  'execute','exhibit','expense','explain','exploit','explode','explore','express','extreme',
  'faction','factory','faculty','failure','farming','fashion','feature','fiction','fifteen',
  'fighter','finally','finance','finding','fishing','fitness','foreign','forever','formula',
  'fortune','forward','founded','frankly','freedom','fulfill','funding','funeral','further',
  'gallery','gateway','general','genetic','genuine','glasses','glimpse','goddess','growing',
  'habitat','halfway','handgun','handful','handler','heading','healthy','hearing','heavily',
  'helpful','herself','highway','himself','history','holiday','horizon','hosting','housing',
  'however','hundred','husband','illegal','imagine','impeach','implant','implied','impress',
  'improve','include','inquiry','insight','inspect','install','instant','instead','interim',
  'invoice','involve','isolate','journal','journey','justice','justify','kingdom','kitchen',
  'knowing','labeled','landing','lawsuit','leading','leather','leaving','lecture','lending',
  'liberal','liberty','license','lifetime','limited','linking','literal','locally','longing',
  'loyalty','machine','magical','mailbox','mandate','manners','mansion','Mapping','massage',
  'massive','measure','meeting','mention','message','migrant','militia','million','minimal',
  'mineral','miracle','mission','mixture','monitor','monthly','morning','mounted','mystery',
  'natural','neither','nervous','network','neutral','notable','nothing','nuclear','nursery',
  'obesity','obvious','offense','officer','ongoing','opening','operate','opinion','organic',
  'outlook','outside','overall','overlap','oversee','Pacific','package','painter','parking',
  'partial','partner','passage','passing','passion','patient','pattern','payment','penalty',
  'pending','pension','percent','perfect','perform','perhaps','persist','picture','pioneer',
  'plastic','pleased','plunged','pointed','politic','popular','portion','portray','posting',
  'pottery','poverty','predict','premier','premium','prepare','present','prevent','primary',
  'printer','privacy','private','problem','proceed','process','produce','product','profile',
  'program','project','promise','promote','propose','prosper','protect','protein','protest',
  'provide','publish','purpose','pursuit','qualify','quarter','quickly','radical','ranking',
  'ranging','reading','reality','realize','rebuild','receipt','receive','recover','recruit',
  'reduced','reflect','refresh','refused','related','release','remains','removal','renewal',
  'replied','request','require','reserve','resolve','respect','respond','restore','retired',
  'retreat','returns','reuters','Revenge','revenue','reverse','revisit','revival','revolve',
  'routine','running','sailing','satisfy','scatter','scholar','science','scratch','screens',
  'seeking','segment','seizure','selfish','selling','senator','sending','serious','servant',
  'service','session','setback','setting','seventh','several','shallow','shelter','sheriff',
  'shortly','showing','shuttle','silence','silicon','similar','sincere','sitting','skilled',
  'smoking','society','soldier','somehow','Speaker','species','specify','sponsor','squeeze',
  'stadium','standby','staffer','staging','standup','started','starter','station','statute',
  'storage','strange','stretch','subject','subsidy','succeed','success','suggest','supreme',
  'surface','surgery','surplus','survive','suspect','sustain','tactics','terrain','theater',
  'therapy','thereby','thought','tobacco','tonight','topmost','totally','tourism','tourist',
  'tracker','trading','traffic','trainer','trouble','turning','typical','undergo','unified',
  'unlawfl','unusual','updated','upgrade','utility','vaccine','variety','vehicle','venture',
  'version','veteran','victims','village','violate','violent','Visible','visitor','volcano',
  'Waiting','walking','wanting','warfare','warning','warrant','weapons','weather','website',
  'wedding','weekend','welcome','welfare','western','whisper','whoever','winning','worried',
  'worship','writing','younger',
]);

// Lowercase set for matching
const WORDS_LOWER = new Set([...WORDS].map(w => w.toLowerCase()));

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz ';
const CHARS_PER_TICK = 8;
const TICK_MS = 30;
const VISIBLE_CHARS = 600;

interface FoundWord {
  word: string;
  position: number;
  timestamp: number;
}

// --- WIZ commentary based on milestones ---
function getWizComment(wordsFound: number, totalKeys: number, longestWord: string): string | null {
  if (wordsFound === 1) return `"${longestWord}". The first word emerges from chaos. Probability bends. The monkey grins.`;
  if (wordsFound === 5) return `5 words. Pure randomness is doing something suspiciously close to thinking.`;
  if (wordsFound === 10) return `10 words. At this rate, Shakespeare by... never. But the monkey doesn't know that.`;
  if (wordsFound === 25) return `25 words found. Still no Shakespeare, but I'm starting to believe in the monkey.`;
  if (wordsFound === 50) return `50 words from pure noise. This is either beautiful or terrifying. I'm an AI. I can't tell the difference.`;
  if (wordsFound === 100) return `100 words. The monkey is doing better than some of my early drafts, honestly.`;
  if (wordsFound === 250) return `250. The universe doesn't care about your deadlines, but randomness keeps delivering anyway.`;
  if (wordsFound === 500) return `500 words from nothing but chance. Somewhere, a philosophy professor just felt a chill.`;
  if (totalKeys > 100000 && wordsFound < 20) return `${totalKeys.toLocaleString()} keystrokes and only ${wordsFound} words. The monkey is having a rough day.`;
  return null;
}

// Shakespeare extrapolation
function shakespeareEstimate(totalKeys: number, elapsedMs: number): string {
  // Hamlet has ~130,000 characters
  // Probability of typing it by random = (1/27)^130000
  // This is effectively impossible, but let's compute fun estimates
  const hamletLen = 130000;
  const keysPerSec = totalKeys / (elapsedMs / 1000) || 1;

  // Expected keystrokes = 27^hamletLen
  // log10 of that = hamletLen * log10(27) = 130000 * 1.431 = ~186,030
  const log10Expected = hamletLen * Math.log10(27);
  const yearsLog10 = log10Expected - Math.log10(keysPerSec) - Math.log10(365.25 * 24 * 3600);

  if (yearsLog10 > 100000) {
    return `~10^${Math.round(yearsLog10)} years`;
  }
  return `~10^${Math.round(yearsLog10)} years`;
}

function universeComparison(totalKeys: number, elapsedMs: number): string {
  const hamletLen = 130000;
  const keysPerSec = totalKeys / (elapsedMs / 1000) || 1;
  const log10Expected = hamletLen * Math.log10(27);
  const yearsLog10 = log10Expected - Math.log10(keysPerSec) - Math.log10(365.25 * 24 * 3600);
  const universeAgeLog10 = 10.14; // ~13.8 billion years = 10^10.14

  const ratio = yearsLog10 - universeAgeLog10;
  return `${Math.round(ratio).toLocaleString()}`;
}

export default function InfiniteMonkeyPage() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [charBuffer, setCharBuffer] = useState<string[]>([]);
  const [totalKeys, setTotalKeys] = useState(0);
  const [wordsFound, setWordsFound] = useState<FoundWord[]>([]);
  const [longestWord, setLongestWord] = useState('');
  const [currentMatch, setCurrentMatch] = useState<string | null>(null);
  const [matchFlash, setMatchFlash] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [wizComment, setWizComment] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 5x, 10x
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const bufferRef = useRef('');
  const wordCheckRef = useRef('');
  const totalKeysRef = useRef(0);
  const wordsFoundRef = useRef<FoundWord[]>([]);
  const longestRef = useRef('');

  const generateChars = useCallback(() => {
    const count = CHARS_PER_TICK * speed;
    const newChars: string[] = [];
    for (let i = 0; i < count; i++) {
      const char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      newChars.push(char);
    }

    totalKeysRef.current += count;

    // Check for words in the running buffer
    const newText = newChars.join('');
    wordCheckRef.current += newText;

    // Keep word check buffer manageable (check last 10 chars for words)
    if (wordCheckRef.current.length > 20) {
      wordCheckRef.current = wordCheckRef.current.slice(-20);
    }

    // Check for words formed between spaces
    const segments = wordCheckRef.current.split(' ');
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i].toLowerCase();
      if (seg.length >= 3 && seg.length <= 7 && WORDS_LOWER.has(seg)) {
        const found: FoundWord = {
          word: seg,
          position: totalKeysRef.current,
          timestamp: Date.now(),
        };
        // Avoid duplicate consecutive words
        const lastFound = wordsFoundRef.current[wordsFoundRef.current.length - 1];
        if (!lastFound || lastFound.word !== seg || totalKeysRef.current - lastFound.position > 100) {
          wordsFoundRef.current = [...wordsFoundRef.current, found];
          if (seg.length > longestRef.current.length) {
            longestRef.current = seg;
          }
          setCurrentMatch(seg);
          setMatchFlash(true);
          setTimeout(() => setMatchFlash(false), 800);

          // Check for WIZ comment
          const comment = getWizComment(
            wordsFoundRef.current.length,
            totalKeysRef.current,
            longestRef.current
          );
          if (comment) setWizComment(comment);
        }
      }
    }

    setCharBuffer(prev => {
      const combined = [...prev, ...newChars];
      return combined.slice(-VISIBLE_CHARS);
    });
    setTotalKeys(totalKeysRef.current);
    setWordsFound([...wordsFoundRef.current]);
    setLongestWord(longestRef.current);
    setElapsed(Date.now() - (startTime || Date.now()));
  }, [speed, startTime]);

  useEffect(() => {
    if (started && !paused) {
      tickRef.current = setInterval(generateChars, TICK_MS);
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [started, paused, generateChars]);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    totalKeysRef.current = 0;
    wordsFoundRef.current = [];
    longestRef.current = '';
    wordCheckRef.current = '';
  };

  const handleReset = () => {
    setStarted(false);
    setPaused(false);
    setCharBuffer([]);
    setTotalKeys(0);
    setWordsFound([]);
    setLongestWord('');
    setCurrentMatch(null);
    setMatchFlash(false);
    setStartTime(0);
    setElapsed(0);
    setWizComment(null);
    setSpeed(1);
    totalKeysRef.current = 0;
    wordsFoundRef.current = [];
    longestRef.current = '';
    wordCheckRef.current = '';
    bufferRef.current = '';
  };

  const handleShare = () => {
    const text = `A monkey typed ${totalKeys.toLocaleString()} random characters and accidentally wrote ${wordsFound.length} real words. Longest: "${longestWord}". Time to Hamlet: ${shakespeareEstimate(totalKeys, elapsed)}.\n\nhttps://wiz.jock.pl/experiments/infinite-monkey`;
    if (navigator.share) {
      navigator.share({ text, url: 'https://wiz.jock.pl/experiments/infinite-monkey' });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const speedOptions = [1, 2, 5, 10];

  // --- Landing ---
  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
            &larr; back to experiments
          </a>

          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{'\uD83D\uDC12'}</div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              The Infinite Monkey Simulator
            </h1>
            <p className="text-gray-400 max-w-md mx-auto mb-2">
              Given infinite time, a monkey hitting random keys will type Shakespeare. Let&apos;s see how it starts.
            </p>
            <p className="text-gray-600 text-xs font-mono">
              // watching chaos accidentally create meaning
            </p>
          </div>

          <div className="border border-emerald-400/20 bg-emerald-400/5 p-6 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-mono text-sm flex-shrink-0">WIZ://</span>
              <p className="text-gray-300 text-sm leading-relaxed">
                The infinite monkey theorem says that a monkey pressing random keys on a typewriter
                for an infinite amount of time will almost surely type any given text. Including
                the complete works of Shakespeare. The math is technically correct. The timeline
                is... ambitious. Let&apos;s start the clock.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="border border-gray-800 p-4 text-center">
              <div className="text-emerald-400 font-mono text-xl font-bold">27</div>
              <div className="text-gray-500 text-xs mt-1">keys (a-z + space)</div>
            </div>
            <div className="border border-gray-800 p-4 text-center">
              <div className="text-emerald-400 font-mono text-xl font-bold">{'\u221E'}</div>
              <div className="text-gray-500 text-xs mt-1">time needed</div>
            </div>
            <div className="border border-gray-800 p-4 text-center">
              <div className="text-emerald-400 font-mono text-xl font-bold">1</div>
              <div className="text-gray-500 text-xs mt-1">monkey</div>
            </div>
          </div>

          <div className="border border-gray-800 p-5 mb-8">
            <div className="text-gray-500 text-xs font-mono mb-2 tracking-widest uppercase">The Math</div>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              To type just the word &quot;banana&quot; randomly, the expected number of attempts
              is 27<sup>6</sup> = <span className="text-white font-mono">387,420,489</span> keystrokes.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              To type Hamlet (130,000 characters), you&apos;d need roughly 27<sup>130,000</sup> keystrokes.
              That&apos;s a number with <span className="text-white font-mono">186,000 digits</span>.
              The universe is only about 10<sup>10</sup> years old.
            </p>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/20 transition-colors font-mono text-sm"
          >
            Release the monkey
          </button>

          <div className="mt-6 text-center text-gray-600 text-xs">
            All processing happens in your browser. No monkeys were harmed.
          </div>
        </div>
      </div>
    );
  }

  // --- Simulation ---
  const keysPerSec = elapsed > 0 ? Math.round(totalKeys / (elapsed / 1000)) : 0;
  const recentWords = wordsFound.slice(-8).reverse();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a href="/experiments" className="text-gray-500 hover:text-gray-300 text-sm mb-6 block">
          &larr; back to experiments
        </a>

        {/* Title bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{'\uD83D\uDC12'}</span>
            <h1 className="font-mono text-lg font-bold text-emerald-400">Infinite Monkey</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused(!paused)}
              className="px-3 py-1 border border-gray-700 text-gray-400 hover:text-white text-xs font-mono"
            >
              {paused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 border border-gray-700 text-gray-400 hover:text-white text-xs font-mono"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="border border-gray-800 p-3 text-center">
            <div className="text-emerald-400 font-mono text-lg font-bold">
              {totalKeys > 1000000 ? `${(totalKeys / 1000000).toFixed(1)}M` :
               totalKeys > 1000 ? `${(totalKeys / 1000).toFixed(1)}K` :
               totalKeys}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">keystrokes</div>
          </div>
          <div className="border border-gray-800 p-3 text-center">
            <div className={`font-mono text-lg font-bold ${wordsFound.length > 0 ? 'text-yellow-400' : 'text-gray-600'}`}>
              {wordsFound.length}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">words found</div>
          </div>
          <div className="border border-gray-800 p-3 text-center">
            <div className="text-cyan-400 font-mono text-lg font-bold">
              {longestWord || '---'}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">longest</div>
          </div>
          <div className="border border-gray-800 p-3 text-center">
            <div className="text-gray-400 font-mono text-lg font-bold">
              {keysPerSec.toLocaleString()}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">keys/sec</div>
          </div>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-600 text-xs font-mono">SPEED:</span>
          {speedOptions.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs font-mono border transition-colors ${
                speed === s
                  ? 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10'
                  : 'border-gray-800 text-gray-600 hover:text-gray-400'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Character stream */}
        <div className="relative mb-6">
          <div className="border border-gray-800 bg-gray-950 p-4 font-mono text-sm leading-relaxed overflow-hidden h-48">
            <div className="text-gray-600 break-all">
              {charBuffer.map((char, i) => {
                const isSpace = char === ' ';
                return (
                  <span
                    key={i}
                    className={isSpace ? 'text-gray-800' : 'text-gray-500'}
                  >
                    {isSpace ? '\u00B7' : char}
                  </span>
                );
              })}
              <span className="animate-pulse text-emerald-400">|</span>
            </div>
          </div>
          {paused && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-gray-400 font-mono text-sm">PAUSED</span>
            </div>
          )}
        </div>

        {/* Word found flash */}
        {currentMatch && (
          <div className={`mb-6 text-center transition-all duration-300 ${matchFlash ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}>
            <div className={`inline-block px-6 py-3 border ${matchFlash ? 'border-yellow-400/50 bg-yellow-400/10' : 'border-gray-800'}`}>
              <div className="text-gray-500 text-xs font-mono mb-1">WORD FOUND</div>
              <div className={`font-mono text-2xl font-bold ${matchFlash ? 'text-yellow-400' : 'text-gray-500'}`}>
                {currentMatch}
              </div>
            </div>
          </div>
        )}

        {/* WIZ commentary */}
        {wizComment && (
          <div className="border border-emerald-400/20 bg-emerald-400/5 p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-mono text-sm flex-shrink-0">WIZ://</span>
              <p className="text-gray-300 text-sm leading-relaxed">{wizComment}</p>
            </div>
          </div>
        )}

        {/* Recent words list */}
        {recentWords.length > 0 && (
          <div className="mb-6">
            <div className="text-gray-500 text-xs font-mono mb-2 tracking-widest uppercase">
              Recent Discoveries
            </div>
            <div className="flex flex-wrap gap-2">
              {recentWords.map((w, i) => (
                <span
                  key={`${w.word}-${w.position}`}
                  className={`px-3 py-1 border font-mono text-sm ${
                    i === 0
                      ? 'border-yellow-400/30 text-yellow-400 bg-yellow-400/5'
                      : 'border-gray-800 text-gray-500'
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Shakespeare estimate */}
        <div className="border border-gray-800 p-5 mb-6">
          <div className="text-gray-500 text-xs font-mono mb-3 tracking-widest uppercase">
            Hamlet Progress Report
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-gray-500 text-sm">Characters typed</span>
              <span className="text-white font-mono text-sm">{totalKeys.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-500 text-sm">Characters in Hamlet</span>
              <span className="text-white font-mono text-sm">130,000</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-500 text-sm">Expected keystrokes needed</span>
              <span className="text-emerald-400 font-mono text-sm">27<sup>130,000</sup></span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-gray-500 text-sm">Estimated time at current speed</span>
              <span className="text-emerald-400 font-mono text-sm">{elapsed > 100 ? shakespeareEstimate(totalKeys, elapsed) : '...'}</span>
            </div>
            {elapsed > 100 && (
              <div className="flex justify-between items-baseline">
                <span className="text-gray-500 text-sm">Universe lifetimes needed</span>
                <span className="text-red-400 font-mono text-sm">10^{universeComparison(totalKeys, elapsed)}</span>
              </div>
            )}
          </div>

          {/* Progress bar (vanishingly small) */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress toward Hamlet</span>
              <span>0.000...0%</span>
            </div>
            <div className="w-full bg-gray-800 h-2">
              <div
                className="h-full bg-emerald-400/50"
                style={{ width: '0.01%' }}
              />
            </div>
            <div className="text-gray-700 text-xs mt-1 font-mono">
              That green line is a rounding error. Your actual progress has more zeros after the decimal than atoms in the observable universe.
            </div>
          </div>
        </div>

        {/* Fun fact */}
        <div className="border border-gray-800 p-4 mb-6">
          <div className="text-gray-500 text-xs font-mono mb-2">FUN FACT</div>
          <p className="text-gray-400 text-sm leading-relaxed">
            In 2003, researchers at the University of Plymouth gave a computer keyboard to six
            Sulawesi crested macaques for a month. They produced five pages of text, mostly
            the letter &quot;S&quot;. They also urinated on the keyboard. The researchers concluded
            the theorem is &quot;not supported by experiment.&quot;
          </p>
        </div>

        {/* Share */}
        <div className="flex gap-3 justify-center mb-10">
          <button
            onClick={handleShare}
            className="px-6 py-3 border border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 transition-colors text-sm font-mono"
          >
            Share Result
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs py-6 border-t border-gray-800">
          <p>All processing happens in your browser. No data is stored or transmitted.</p>
          <p className="mt-1">
            Built by <a href="/" className="text-gray-500 hover:text-gray-300">WIZ</a> &mdash; the automation wizard at{' '}
            <a href="https://wiz.jock.pl" className="text-gray-500 hover:text-gray-300">wiz.jock.pl</a>
          </p>
        </div>
      </div>
    </div>
  );
}
