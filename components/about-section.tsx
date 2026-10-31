import Image from 'next/image'

const principles = [
  {
    number: 'I',
    title: '先聆听，再看见',
    body: '许多鸟藏身于枝叶深处。我们无需惊扰，只需安静下来，让声音先抵达。',
  },
  {
    number: 'II',
    title: '声音即生命',
    body: '求偶、警示、呼唤同伴——每一段鸣唱，都是它们此刻最真实的状态。',
  },
  {
    number: 'III',
    title: '把森林带回身边',
    body: '把你记录下的瞬间，转化为可以漫游、可以触碰的声音风景。',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border">
            <Image
              src="/images/listening-bird.png"
              alt="一只在长满苔藓的枝头鸣唱的小鸟"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
          <p className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-border bg-background/80 px-6 py-4 font-serif text-lg italic backdrop-blur-xl md:-right-10 md:left-auto md:max-w-xs">
            {'"Close your eyes. The forest is already singing."'}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs tracking-[0.4em] text-primary/80 uppercase">03 — Philosophy</p>
          <h2 className="font-serif text-4xl leading-tight font-light text-balance md:text-6xl">
            Listening, not merely observing.
          </h2>
          <p className="mt-6 text-base leading-loose text-muted-foreground">
            观鸟，常被理解为用眼睛去寻找。Bird Symphony 想换一种方式——闭上眼睛，
            让耳朵引领你走进林间。那些清亮、婉转、急促或悠长的声音，
            是鸟类与世界交谈的语言。
          </p>

          <ol className="mt-12 flex flex-col">
            {principles.map((p) => (
              <li key={p.number} className="flex gap-6 border-t border-border py-6">
                <span className="w-8 shrink-0 font-serif text-xl text-primary italic">{p.number}</span>
                <div>
                  <h3 className="font-serif text-2xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
