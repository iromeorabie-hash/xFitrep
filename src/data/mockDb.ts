import { Category, Video, User } from "../types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-chest",
    name: "Chest Exercises Section",
    description: "Build upper, lower, and mid-chest muscles with press and fly exercises."
  },
  {
    id: "cat-back",
    name: "Upper",
    description: "Strengthen your lats, traps, and upper body muscles."
  },
  {
    id: "cat-traps",
    name: "Traps",
    description: "Isolate and build thicker, more defined trap muscles."
  },
  {
    id: "cat-triceps",
    name: "Triceps",
    description: "Tone and strengthen your triceps with standard and cable extensions."
  },
  {
    id: "cat-shoulder",
    name: "Shoulder",
    description: "Develop broad shoulders using compound presses and lateral raises."
  },
  {
    id: "cat-biceps",
    name: "Biceps",
    description: "Hypertrophy training for peak and thicker biceps."
  },
  {
    id: "cat-abs",
    name: "Abs",
    description: "Sculpt solid, strong abs and obliques with active routines."
  },
  {
    id: "cat-obliques",
    name: "Obliques",
    description: "Focus on the side core, rotational power, and stabilization."
  },
  {
    id: "cat-legs",
    name: "Legs",
    description: "Strengthen calves, hamstrings, glutes, and quads."
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // CHEST
  {
    id: "vid-chest-1",
    title: "Bench press",
    description: "An essential chest exercise to build power, thickness, and upper body pushing strength.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/rgdpam.mp4",
    duration: 5,
    views: 242,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T08:00:00Z"
  },
  {
    id: "vid-chest-2",
    title: "Push up",
    description: "A fundamental bodyweight compound movement to build endurance and stabilize chest mechanics.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/u8pc3r.mp4",
    duration: 3,
    views: 198,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T08:00:00Z"
  },
  {
    id: "vid-chest-3",
    title: "Dumbbell incline bench press",
    description: "An excellent isolation exercise targeting the clavicular head of the pectoralis major.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/uymtli.mp4",
    duration: 5,
    views: 312,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T08:00:00Z"
  },
  {
    id: "vid-chest-4",
    title: "Machine pes fly",
    description: "Isolate the inner chest fibers using high-tension, constant resistance fly movement.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/qy4o7j.mp4",
    duration: 4,
    views: 154,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T08:00:00Z"
  },
  {
    id: "vid-chest-5",
    title: "Dumbbell incline chest flys",
    description: "Maximize chest muscle stretching at the bottom phase with dumbbells on an incline.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/czgs9n.mp4",
    duration: 4,
    views: 187,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T08:00:00Z"
  },
  {
    id: "vid-chest-6",
    title: "Barbell incline bench press",
    description: "Build compound pressing power for the upper pecs using a barbell on an incline.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/zowl03.mp4",
    duration: 5,
    views: 201,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T08:00:00Z"
  },
  {
    id: "vid-chest-7",
    title: "Cable chest press",
    description: "Utilize cable tension for a controlled, muscle-toning horizontal push motion.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/3cwntq.mp4",
    duration: 4,
    views: 110,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T08:00:00Z"
  },
  {
    id: "vid-chest-8",
    title: "Cable pec fly",
    description: "Maintain constant contraction across the entire chest squeeze utilizing cables.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/mgjno4.mp4",
    duration: 4,
    views: 125,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-08T08:00:00Z"
  },
  {
    id: "vid-chest-9",
    title: "Dips",
    description: "A powerhouse bodyweight exercise focusing on lower chest dips and core control.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/h0oghv.mp4",
    duration: 3,
    views: 231,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-09T08:00:00Z"
  },
  {
    id: "vid-chest-10",
    title: "Dumbbell bench press",
    description: "Improve chest hypertrophy and unilateral stability with heavy dumbbell presses.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/erwsxa.mp4",
    duration: 5,
    views: 280,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-10T08:00:00Z"
  },
  {
    id: "vid-chest-11",
    title: "Kettlebll chest press Single",
    description: "Unilateral kettlebell press to challenge core stability and chest fibers.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/ryb4qy.mp4",
    duration: 4,
    views: 98,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-11T08:00:00Z"
  },
  {
    id: "vid-chest-12",
    title: "Neutral chest press",
    description: "A chest press variation using neutral grip to reduce shoulder strain and emphasize pecs.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/w9kpnj.mp4",
    duration: 4,
    views: 85,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-12T08:00:00Z"
  },
  {
    id: "vid-chest-13",
    title: "Smith machine bench press",
    description: "Perform strict pressing along a guided track to isolate pectoralis major fibers.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/bjsdzk.mp4",
    duration: 5,
    views: 174,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-13T08:00:00Z"
  },
  {
    id: "vid-chest-14",
    title: "Smith machine incline bench press",
    description: "Isolate upper chest fibers safely along a guided vertical smith machine track.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/dkifls.mp4",
    duration: 5,
    views: 142,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-14T08:00:00Z"
  },
  {
    id: "vid-chest-15",
    title: "Machine machine plate loaded low incline bench press",
    description: "Develop massive chest power with plate-loaded low incline press machinery.",
    categoryId: "cat-chest",
    url: "https://files.catbox.moe/7rmgey.mp4",
    duration: 5,
    views: 119,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-15T08:00:00Z"
  },

  // BACK
  {
    id: "vid-back-1",
    title: "Machine face pulls",
    description: "Strengthen the upper back, rear delts, and support healthy scapular movement.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/xix6f3.mp4",
    duration: 4,
    views: 135,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T09:00:00Z"
  },
  {
    id: "vid-back-2",
    title: "Machin reverse fly",
    description: "Isolate your rear deltas and improve upper body posture using the reverse fly machine.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/dkt9x6.mp4",
    duration: 4,
    views: 142,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T09:00:00Z"
  },
  {
    id: "vid-back-3",
    title: "Dumbbells seated rear delt fly",
    description: "Target the posterior deltoid head with controlled seated dumbbell flys.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/wcgqhu.mp4",
    duration: 4,
    views: 165,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T09:00:00Z"
  },
  {
    id: "vid-back-4",
    title: "Cables rear delt fly",
    description: "Maintain constant tension on rear delts with double-cable reverse crossovers.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/r995az.mp4",
    duration: 4,
    views: 112,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T09:00:00Z"
  },
  {
    id: "vid-back-5",
    title: "Dumbbell rear delt row",
    description: "Combine pulling power and shoulder health by rowing dumbbells targeting rear delts.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/zpdqvi.mp4",
    duration: 4,
    views: 128,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T09:00:00Z"
  },
  {
    id: "vid-back-6",
    title: "dumbbell laying reverse fly",
    description: "Perform reverse flyes while laying down to prevent momentum and isolate upper back.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/857k73.mp4",
    duration: 4,
    views: 94,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T09:00:00Z"
  },
  {
    id: "vid-back-7",
    title: "Cable lat prayer",
    description: "Isolate your lats with a full range of motion using the cable lat prayer technique.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/bv6nod.mp4",
    duration: 4,
    views: 124,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T09:00:00Z"
  },
  {
    id: "vid-back-8",
    title: "Push ups",
    description: "Classic bodyweight exercise to build chest, shoulders, triceps, and core strength.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/rupplj.mp4",
    duration: 3,
    views: 310,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-08T09:00:00Z"
  },
  {
    id: "vid-back-9",
    title: "Machine Pull down",
    description: "Develop lat width and back strength with a controlled machine pulldown motion.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/pad4xc.mp4",
    duration: 4,
    views: 198,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-09T09:00:00Z"
  },
  {
    id: "vid-back-10",
    title: "Barbell bent over row",
    description: "A foundational compound exercise to build thickness and power throughout the entire back.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/5k7ljx.mp4",
    duration: 4,
    views: 245,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-10T09:00:00Z"
  },
  {
    id: "vid-back-11",
    title: "Machine seated cable row",
    description: "Maintain continuous tension on the mid-back and lats with a seated cable row.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/rzi50q.mp4",
    duration: 4,
    views: 187,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-11T09:00:00Z"
  },
  {
    id: "vid-back-12",
    title: "Kettlebll pull over",
    description: "Stretch and strengthen the lats and chest using a kettlebell pull over.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/1hhia1.mp4",
    duration: 4,
    views: 115,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-12T09:00:00Z"
  },
  {
    id: "vid-back-13",
    title: "Dumbbell kneeling single arm row",
    description: "Isolate each side of the back and correct strength imbalances with single arm rows.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/g35lnk.mp4",
    duration: 4,
    views: 167,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-13T09:00:00Z"
  },
  {
    id: "vid-back-14",
    title: "Dumbbell shoulder extension",
    description: "Activate posterior shoulders and upper back with targeted dumbbell extensions.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/cpg16h.mp4",
    duration: 3,
    views: 92,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-14T09:00:00Z"
  },
  {
    id: "vid-back-15",
    title: "Dumbbell single arm row",
    description: "Build upper back density and grip strength with single arm dumbbell rows.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/945i7j.mp4",
    duration: 4,
    views: 189,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-15T09:00:00Z"
  },
  {
    id: "vid-back-16",
    title: "Smith machine over hand row",
    description: "Row with stability and a strict bar path using the Smith machine overhand setup.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/brxcdy.mp4",
    duration: 4,
    views: 143,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-16T09:00:00Z"
  },
  {
    id: "vid-back-17",
    title: "Smith machine inverted row",
    description: "Excellent bodyweight pulling exercise using the Smith machine for customizable height.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/dq1efg.mp4",
    duration: 3,
    views: 122,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-17T09:00:00Z"
  },
  {
    id: "vid-back-18",
    title: "machine chest supported t-bar row",
    description: "Eliminate lower back fatigue and isolate the mid-back with a chest supported T-bar row.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/icftmp.mp4",
    duration: 4,
    views: 210,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-18T09:00:00Z"
  },
  {
    id: "vid-back-19",
    title: "Machine plate loaded pulldown",
    description: "Load with plates to target specific lat sections with natural biomechanics.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/vgkpqx.mp4",
    duration: 4,
    views: 175,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-19T09:00:00Z"
  },
  {
    id: "vid-back-20",
    title: "Cables kayakrow",
    description: "Engage the lats and core in a unique rotational paddling-style cable row.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/u7pu4n.mp4",
    duration: 4,
    views: 132,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-20T09:00:00Z"
  },
  {
    id: "vid-back-21",
    title: "Barbell deadlift",
    description: "The ultimate posterior chain compound lift for maximum full-body strength.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/4c5fl4.mp4",
    duration: 5,
    views: 450,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-21T09:00:00Z"
  },
  {
    id: "vid-back-22",
    title: "Machine back extensions",
    description: "Safely isolate and strengthen your erector spinae and lower back muscles.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/kujd1z.mp4",
    duration: 4,
    views: 154,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-22T09:00:00Z"
  },
  {
    id: "vid-back-23",
    title: "Barbell low bar good morning",
    description: "Build exceptional hip hinge power and lower back strength with low bar good mornings.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/p1spiz.mp4",
    duration: 4,
    views: 118,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-23T09:00:00Z"
  },
  {
    id: "vid-back-24",
    title: "supermans",
    description: "Bodyweight floor exercise to target lower back, glutes, and upper back extensors.",
    categoryId: "cat-back",
    url: "https://files.catbox.moe/yiy2uv.mp4",
    duration: 3,
    views: 160,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-24T09:00:00Z"
  },

  // TRAPS
  {
    id: "vid-traps-1",
    title: "Barbell-silverback-shrug",
    description: "Build upper traps thickness with the specialized silverback posture shrug.",
    categoryId: "cat-traps",
    url: "https://files.catbox.moe/21jmer.mp4",
    duration: 3,
    views: 150,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "vid-traps-2",
    title: "Cables-30-degree-shrug",
    description: "Shrug along a 30-degree line matching your trap fiber direction with cables.",
    categoryId: "cat-traps",
    url: "https://files.catbox.moe/hrue58.mp4",
    duration: 4,
    views: 105,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T10:00:00Z"
  },
  {
    id: "vid-traps-3",
    title: "Dumbbells shrug",
    description: "A classic trap building exercise targeting upper trapezius with heavy dumbbells.",
    categoryId: "cat-traps",
    url: "https://files.catbox.moe/tsq4v8.mp4",
    duration: 3,
    views: 195,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T10:00:00Z"
  },
  {
    id: "vid-traps-4",
    title: "Barbell-upright-row",
    description: "Build traps and lateral delts with close-grip barbell upright rows.",
    categoryId: "cat-traps",
    url: "https://files.catbox.moe/oa11ve.mp4",
    duration: 4,
    views: 118,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T10:00:00Z"
  },
  {
    id: "vid-traps-5",
    title: "kettlebell-incline-shrug",
    description: "Engage mid and upper traps with angled kettlebell shrugs on an incline.",
    categoryId: "cat-traps",
    url: "https://files.catbox.moe/gy31yt.mp4",
    duration: 3,
    views: 88,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T10:00:00Z"
  },

  // TRICEPS
  {
    id: "vid-triceps-1",
    title: "Cable-push-down",
    description: "Isolate the lateral and medial heads of the triceps with a smooth cable pushdown.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/evbrhz.mp4",
    duration: 4,
    views: 215,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T11:00:00Z"
  },
  {
    id: "vid-triceps-2",
    title: "Barbell-close-grip-bench-press",
    description: "A heavy compound triceps builder focusing on elbow extension under load.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/co64pb.mp4",
    duration: 5,
    views: 185,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T11:00:00Z"
  },
  {
    id: "vid-triceps-3",
    title: "Dumbbell-skullcrusher",
    description: "Deeply stretch the long head of the triceps with dumbbells lowered towards the ears.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/bwjumm.mp4",
    duration: 4,
    views: 172,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T11:00:00Z"
  },
  {
    id: "vid-triceps-4",
    title: "Bench-dips",
    description: "Bodyweight exercise to isolate triceps with elevated feet or hands behind the hips.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/kxts0z.mp4",
    duration: 3,
    views: 210,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T11:00:00Z"
  },
  {
    id: "vid-triceps-5",
    title: "Cable-overhead-tricep-extension",
    description: "Target the triceps in their fully stretched position with overhead cable pulls.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/zv967z.mp4",
    duration: 4,
    views: 164,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T11:00:00Z"
  },
  {
    id: "vid-triceps-6",
    title: "Diamond-push-ups",
    description: "Close-hand compound pushup variation to heavily engage the triceps medial head.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/08506t.mp4",
    duration: 3,
    views: 140,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T11:00:00Z"
  },
  {
    id: "vid-triceps-7",
    title: "Kettlebell-decline-skull-crusher",
    description: "Perform deep triceps skull crushers on a decline bench using kettlebells.",
    categoryId: "cat-triceps",
    url: "https://files.catbox.moe/bxe8fv.mp4",
    duration: 4,
    views: 95,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T11:00:00Z"
  },

  // SHOULDER
  {
    id: "vid-shoulder-1",
    title: "Dumbbell-seated-overhead-press",
    description: "Classic shoulder-builder focusing on anterior delts and overhead stabilization.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/hv3fpu.mp4",
    duration: 5,
    views: 230,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T12:00:00Z"
  },
  {
    id: "vid-shoulder-2",
    title: "Cable-lateral-raise",
    description: "Isolate the lateral head of the deltoids under constant tension from cables.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/sn15z3.mp4",
    duration: 4,
    views: 192,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T12:00:00Z"
  },
  {
    id: "vid-shoulder-3",
    title: "Barbell-overhead-press",
    description: "A ultimate compound strength indicator to build wide and powerful shoulders.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/w1eo4y.mp4",
    duration: 5,
    views: 210,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T12:00:00Z"
  },
  {
    id: "vid-shoulder-4",
    title: "Machine-overhand",
    description: "Overhead shoulder pressing machine to build strength safely along a guided path.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/50we2o.mp4",
    duration: 4,
    views: 125,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T12:00:00Z"
  },
  {
    id: "vid-shoulder-5",
    title: "Dumbbell-lateral-raise",
    description: "The absolute golden standard to build round, capped 3D shoulders.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/wu9g6k.mp4",
    duration: 4,
    views: 245,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T12:00:00Z"
  },
  {
    id: "vid-shoulder-6",
    title: "Dumbbell-full-lateral-raise",
    description: "Perform raises through full range of motion to maximize lateral delt engagement.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/8hg3cp.mp4",
    duration: 4,
    views: 180,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T12:00:00Z"
  },
  {
    id: "vid-shoulder-7",
    title: "Dumbbell-incline-front-raise-",
    description: "Target the front delts with an inclined chest support to prevent swinging.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/kf76jj.mp4",
    duration: 4,
    views: 110,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T12:00:00Z"
  },
  {
    id: "vid-shoulder-8",
    title: "Dumbbell-arnold-press",
    description: "Rotate hands from pronated to supinated for full shoulder development.",
    categoryId: "cat-shoulder",
    url: "https://files.catbox.moe/0n3gs1.mp4",
    duration: 5,
    views: 165,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-08T12:00:00Z"
  },

  // BICEPS
  {
    id: "vid-biceps-1",
    title: "Barbell-curl",
    description: "A classic bicep curls builder targeting the biceps brachii for peak volume.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/9gief4.mp4",
    duration: 4,
    views: 275,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T13:00:00Z"
  },
  {
    id: "vid-biceps-2",
    title: "Dumbbell-preacher-curl",
    description: "Isolate the short head of the biceps on a preacher bench to prevent cheating.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/9u35to.mp4",
    duration: 4,
    views: 212,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T13:00:00Z"
  },
  {
    id: "vid-biceps-3",
    title: "Dumbbell-incline-curl",
    description: "Maximize biceps stretch at the bottom of the movement on an inclined bench.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/xogc5g.mp4",
    duration: 4,
    views: 198,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T13:00:00Z"
  },
  {
    id: "vid-biceps-4",
    title: "Dumbbell-hammer-curl",
    description: "Build thick brachialis and forearm muscles with a neutral hammer grip.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/bq5blj.mp4",
    duration: 4,
    views: 240,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T13:00:00Z"
  },
  {
    id: "vid-biceps-5",
    title: "Dumbbell-curl",
    description: "Dynamic supination bicep curls to stimulate peak muscle contractions.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/2a1zjf.mp4",
    duration: 4,
    views: 185,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T13:00:00Z"
  },
  {
    id: "vid-biceps-6",
    title: "Dumbbell-reverse-curl",
    description: "Engage brachioradialis and strengthen your grip with reverse-grip curls.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/3ms08m.mp4",
    duration: 4,
    views: 130,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T13:00:00Z"
  },
  {
    id: "vid-biceps-7",
    title: "Bayesian-curl",
    description: "An incredible cable curl variation that keeps high tension at full biceps stretch.",
    categoryId: "cat-biceps",
    url: "https://files.catbox.moe/en9yw6.mp4",
    duration: 4,
    views: 155,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T13:00:00Z"
  },

  // ABS
  {
    id: "vid-abs-1",
    title: "Russian-twist",
    description: "Rotational core exercise to sculpt deep abs and strengthen lower back stabilization.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/zhdx2i.mp4",
    duration: 3,
    views: 310,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T14:00:00Z"
  },
  {
    id: "vid-abs-2",
    title: "laying-leg-raises",
    description: "Focus on lower abdominal wall strength with slow, controlled leg lifts.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/jxcqtv.mp4",
    duration: 3,
    views: 280,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T14:00:00Z"
  },
  {
    id: "vid-abs-3",
    title: "Hanging-knee-raises",
    description: "An advanced lower abs movement hanging from a bar to develop core stability.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/zm5kjr.mp4",
    duration: 3,
    views: 215,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T14:00:00Z"
  },
  {
    id: "vid-abs-4",
    title: "Crunch",
    description: "Simple yet effective upper abdominal isolations with slow, focused contractions.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/ortl38.mp4",
    duration: 3,
    views: 320,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T14:00:00Z"
  },
  {
    id: "vid-abs-5",
    title: "Long-lever-plank",
    description: "An intense plank variation with hands forward to maximize rectus abdominis tension.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/fjzwjm.mp4",
    duration: 4,
    views: 145,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T14:00:00Z"
  },
  {
    id: "vid-abs-6",
    title: "Cable-kneeling-crunch",
    description: "Kneeling weighted crunch using cables to build thick abdominal muscle blocks.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/x4jnlv.mp4",
    duration: 4,
    views: 180,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T14:00:00Z"
  },
  {
    id: "vid-abs-7",
    title: "Hollow-hold",
    description: "Gymnastic core hold to build a rock-solid anterior chain and deep core compression.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/xzhl6u.mp4",
    duration: 3,
    views: 122,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T14:00:00Z"
  },
  {
    id: "vid-abs-8",
    title: "Barbell-roll-outs",
    description: "Advanced rollout exercise to test and build extreme anti-extension core power.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/5jfwrm.mp4",
    duration: 4,
    views: 138,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-08T14:00:00Z"
  },
  {
    id: "vid-abs-9",
    title: "kettlebell-situp",
    description: "Weighted situp holding a kettlebell overhead to strengthen hips and abs.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/lqo0ko.mp4",
    duration: 3,
    views: 110,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-09T14:00:00Z"
  },
  {
    id: "vid-abs-10",
    title: "forearm-plank",
    description: "Build full-body tension and core endurance in the classic plank posture.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/cum71g.mp4",
    duration: 4,
    views: 195,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-10T14:00:00Z"
  },
  {
    id: "vid-abs-11",
    title: "Mountain-climber",
    description: "Elevate heart rate and build explosive speed in the lower abs and hips.",
    categoryId: "cat-abs",
    url: "https://files.catbox.moe/at61wl.mp4",
    duration: 3,
    views: 220,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-11T14:00:00Z"
  },

  // OBLIQUES
  {
    id: "vid-obliques-1",
    title: "hand-side-plank",
    description: "Isolate side obliques and improve shoulder stability holding a high side plank.",
    categoryId: "cat-obliques",
    url: "https://files.catbox.moe/983nrb.mp4",
    duration: 3,
    views: 135,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T15:00:00Z"
  },
  {
    id: "vid-obliques-2",
    title: "elbow-side-plank",
    description: "Classic side plank on your elbow to isolate obliques and lateral hip stabilizers.",
    categoryId: "cat-obliques",
    url: "https://files.catbox.moe/85sosh.mp4",
    duration: 3,
    views: 128,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T15:00:00Z"
  },
  {
    id: "vid-obliques-3",
    title: "cable-woodchopper",
    description: "Build rotational power and oblique definition pulling cables diagonally.",
    categoryId: "cat-obliques",
    url: "https://files.catbox.moe/zfwjw3.mp4",
    duration: 4,
    views: 115,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T15:00:00Z"
  },
  {
    id: "vid-obliques-4",
    title: "kettlebell-wood-chopper",
    description: "A functional dynamic movement to build strong obliques using a kettlebell.",
    categoryId: "cat-obliques",
    url: "https://files.catbox.moe/zaf8hg.mp4",
    duration: 4,
    views: 92,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T15:00:00Z"
  },

  // LEGS
  {
    id: "vid-legs-new-1",
    title: "machine-leg-extension",
    description: "Isolate and strengthen the quadriceps muscles with the leg extension machine.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/6y92ou.mp4",
    duration: 3,
    views: 180,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-10T16:00:00Z"
  },
  {
    id: "vid-legs-new-2",
    title: "barbell-squat",
    description: "The king of all leg exercises targeting quads, hamstrings, glutes, and core.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/ryt3rf.mp4",
    duration: 5,
    views: 350,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-11T16:00:00Z"
  },
  {
    id: "vid-legs-new-3",
    title: "dumbbell-goblet-squat",
    description: "A great squat variation holding a dumbbell to build quadriceps strength and mobility.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/774p4x.mp4",
    duration: 4,
    views: 220,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-12T16:00:00Z"
  },
  {
    id: "vid-legs-new-4",
    title: "barbell-step-up",
    description: "Unilateral leg exercise focusing on building balance, quads, and glutes using a barbell.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/jwzcas.mp4",
    duration: 4,
    views: 140,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-13T16:00:00Z"
  },
  {
    id: "vid-legs-new-5",
    title: "machine-leg-press",
    description: "Load heavily and safely to develop lower body strength and mass.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/cnwvwn.mp4",
    duration: 4,
    views: 290,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-14T16:00:00Z"
  },
  {
    id: "vid-legs-new-6",
    title: "forward-lunges",
    description: "Build exceptional unilateral thigh power, stability, and quad definition.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/s2gyjv.mp4",
    duration: 3,
    views: 185,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-15T16:00:00Z"
  },
  {
    id: "vid-legs-new-7",
    title: "bodyweight-squat",
    description: "Excellent bodyweight exercise to master proper squat biomechanics and warm up.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/xcmn69.mp4",
    duration: 3,
    views: 210,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-16T16:00:00Z"
  },
  {
    id: "vid-legs-new-8",
    title: "barbell-curtsy-lunge",
    description: "Target the glutes, hips, and inner/outer thighs with the dynamic curtsy hinge.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/c7sgmt.mp4",
    duration: 4,
    views: 135,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-17T16:00:00Z"
  },
  {
    id: "vid-legs-new-9",
    title: "dumbbell-bulgarian-split-squat",
    description: "The ultimate single-leg builder to target quad and glute hypertrophy and fix imbalances.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/ntz6b7.mp4",
    duration: 4,
    views: 260,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-18T16:00:00Z"
  },
  {
    id: "vid-legs-new-10",
    title: "machine-hack-squat",
    description: "A secure fixed-path squat machine to overload the quadriceps with deep range of motion.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/mc86ro.mp4",
    duration: 4,
    views: 195,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-19T16:00:00Z"
  },
  {
    id: "vid-legs-new-11",
    title: "dumbbell-glute-bridge",
    description: "Isolate your glute muscles with proper pelvic tilts and dumbbell resistance.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/np1nue.mp4",
    duration: 4,
    views: 180,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-20T16:00:00Z"
  },
  {
    id: "vid-legs-new-12",
    title: "barbell-sumo-deadlift",
    description: "A wide-stance deadlift targeting inner thighs, glutes, hamstrings, and lower back.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/t5drfk.mp4",
    duration: 5,
    views: 220,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-21T16:00:00Z"
  },
  {
    id: "vid-legs-new-13",
    title: "machine-horizontal-leg-press",
    description: "Maintain high leg tension in a horizontal pressing motion to build thick quads.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/3fwcff.mp4",
    duration: 4,
    views: 155,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-22T16:00:00Z"
  },
  {
    id: "vid-legs-new-14",
    title: "kettlebell-lateral-lunge-single-",
    description: "Focus on hip mobility, inner thighs, and side glutes using dynamic lateral lunges.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/n11fip.mp4",
    duration: 4,
    views: 112,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-23T16:00:00Z"
  },
  {
    id: "vid-legs-new-15",
    title: "cable-standing-leg-extension",
    description: "Continuous tension standing leg extension to stimulate outer quad sweep.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/rykxgh.mp4",
    duration: 4,
    views: 125,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-24T16:00:00Z"
  },
  {
    id: "vid-legs-new-16",
    title: "dumbbell-goblet-bulgarian-split-squat",
    description: "Perform Bulgarian split squats holding a dumbbell in front of you for posture support.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/7l4o0t.mp4",
    duration: 4,
    views: 145,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-25T16:00:00Z"
  },
  {
    id: "vid-legs-new-17",
    title: "jump-squats",
    description: "Excellent plyometric bodyweight exercise to develop powerful leg extensions and vertical leaps.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/jmmwx3.mp4",
    duration: 3,
    views: 198,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-26T16:00:00Z"
  },
  {
    id: "vid-legs-new-18",
    title: "machine-standing-calf-raises",
    description: "Load your calves standing up to maximize gastrocnemius muscle growth.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/kqtwyq.mp4",
    duration: 4,
    views: 164,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-27T16:00:00Z"
  },
  {
    id: "vid-legs-new-19",
    title: "machine-seated-calf-raise",
    description: "Great seated isolation targeting soleus thickness in the lower calf.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/qt2n8n.mp4",
    duration: 3,
    views: 152,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-28T16:00:00Z"
  },
  {
    id: "vid-legs-new-20",
    title: "barbell-calf-raises",
    description: "Perform calf raises using a barbell to build strength, balance, and calf size.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/avmk3x.mp4",
    duration: 4,
    views: 110,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-29T16:00:00Z"
  },
  {
    id: "vid-legs-1",
    title: "kettlebell-seated-calf-raise",
    description: "Seated calf isolations to develop the soleus muscle using kettlebells.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/s4fk8b.mp4",
    duration: 3,
    views: 145,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-01T16:00:00Z"
  },
  {
    id: "vid-legs-2",
    title: "machine-horizontal-leg-press-calf-jump",
    description: "Explosive calf presses on the horizontal machine to build calf power.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/op5paw.mp4",
    duration: 4,
    views: 112,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-02T16:00:00Z"
  },
  {
    id: "vid-legs-3",
    title: "Smithmachine-calf-raise",
    description: "Build thick gastrocnemius calves with heavy guided calf raises on a Smith machine.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/l50ypy.mp4",
    duration: 3,
    views: 138,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-03T16:00:00Z"
  },
  {
    id: "vid-legs-4",
    title: "barbell-stiff-leg-deadlift",
    description: "Target your hamstrings and lower glutes with strict stiff-legged barbell hinges.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/edhebx.mp4",
    duration: 5,
    views: 195,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-04T16:00:00Z"
  },
  {
    id: "vid-legs-5",
    title: "machine-glute-ham-raise",
    description: "A premium posterior chain exercise to isolate hamstrings and glutes under control.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/d9sih0.mp4",
    duration: 4,
    views: 110,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-05T16:00:00Z"
  },
  {
    id: "vid-legs-6",
    title: "machine-hamstring-curl",
    description: "Isolate and build hamstring mass using a high-tension leg curl machine.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/t3c6bf.mp4",
    duration: 4,
    views: 175,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-06T16:00:00Z"
  },
  {
    id: "vid-legs-7",
    title: "barbell-romanian-deadlift",
    description: "The absolute staple compound exercise to build powerful hamstrings and glutes.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/gjsh3k.mp4",
    duration: 5,
    views: 240,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-07T16:00:00Z"
  },
  {
    id: "vid-legs-8",
    title: "barbell-hip-thrust",
    description: "Build massive glutes and posterior power with weighted barbell hip thrusts.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/ab764w.mp4",
    duration: 5,
    views: 215,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-08T16:00:00Z"
  },
  {
    id: "vid-legs-9",
    title: "Cables-cable-pull-through",
    description: "Hinged posterior workout using cables to isolate glute extension.",
    categoryId: "cat-legs",
    url: "https://files.catbox.moe/cw6o4h.mp4",
    duration: 4,
    views: 120,
    trainer: "Coach Ramadan",
    createdAt: "2026-06-09T16:00:00Z"
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: "user-belal",
    name: "Belal Al-Shami",
    phone: "0501234567",
    password: "123456",
    status: "pending",
    subscription: {
      plan: "None",
      activatedAt: null,
      expiresAt: null,
      durationDays: 0
    },
    favorites: [],
    createdAt: "2026-06-25T12:00:00Z"
  },
  {
    id: "user-sarah",
    name: "Sarah Parker",
    phone: "0507654321",
    password: "123456",
    status: "approved",
    subscription: {
      plan: "Premium",
      activatedAt: "2026-06-17T14:00:00Z",
      expiresAt: "2026-09-15T14:00:00Z", // Expiring in ~80 days
      durationDays: 90
    },
    favorites: [],
    createdAt: "2026-06-17T14:00:00Z"
  },
  {
    id: "user-omar",
    name: "Omar Al-Fayed",
    phone: "0501112222",
    password: "123456",
    status: "approved",
    subscription: {
      plan: "Elite",
      activatedAt: "2025-06-20T10:00:00Z",
      expiresAt: "2026-06-20T10:00:00Z", // Expired 7 days ago relative to June 27, 2026
      durationDays: 365
    },
    favorites: [],
    createdAt: "2025-06-20T10:00:00Z"
  }
];

export function getMockDb() {
  // Use a unique seeding version tag (v5) to guarantee browser refresh is triggered for all users
  const seeded = localStorage.getItem("fitrep_seeded_v5");
  
  if (seeded !== "true") {
    localStorage.setItem("fitrep_categories", JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem("fitrep_videos", JSON.stringify(INITIAL_VIDEOS));
    localStorage.setItem("fitrep_seeded_v5", "true");
  }

  const categories = localStorage.getItem("fitrep_categories");
  const videos = localStorage.getItem("fitrep_videos");
  const users = localStorage.getItem("fitrep_users");

  if (!categories) {
    localStorage.setItem("fitrep_categories", JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!videos) {
    localStorage.setItem("fitrep_videos", JSON.stringify(INITIAL_VIDEOS));
  }
  if (!users) {
    localStorage.setItem("fitrep_users", JSON.stringify(INITIAL_USERS));
  }

  return {
    categories: categories ? JSON.parse(categories) : INITIAL_CATEGORIES,
    videos: videos ? JSON.parse(videos) : INITIAL_VIDEOS,
    users: users ? JSON.parse(users) : INITIAL_USERS
  };
}

export function saveMockDb(data: { categories: Category[]; videos: Video[]; users: User[] }) {
  localStorage.setItem("fitrep_categories", JSON.stringify(data.categories));
  localStorage.setItem("fitrep_videos", JSON.stringify(data.videos));
  localStorage.setItem("fitrep_users", JSON.stringify(data.users));
}
