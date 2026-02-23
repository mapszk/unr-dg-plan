import { useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { subjects } from './data.js';
import { Badge } from './components/ui/badge.jsx';
import { Button } from './components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx';
import { cn } from './lib/utils.js';

const yearLabels = {
  1: '1° Año',
  2: '2° Año',
  3: '3° Año',
  4: '4° Año'
};

function getTypeLabel(subject) {
  if (subject.type === 'anual') return 'Anual';
  return `Cuatrimestral ${subject.term}°`;
}

function getTypeClasses(subject) {
  if (subject.type === 'anual') return 'border-l-blue-600';
  return subject.term === 1 ? 'border-l-violet-500' : 'border-l-emerald-600';
}

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjectsByYear = useMemo(
    () =>
      subjects.reduce((acc, subject) => {
        acc[subject.year] = [...(acc[subject.year] ?? []), subject];
        return acc;
      }, {}),
    []
  );

  const unlocksMap = useMemo(
    () =>
      subjects.reduce((acc, subject) => {
        subject.correlatives.forEach((correlative) => {
          acc[correlative] = [...(acc[correlative] ?? []), subject.name];
        });
        return acc;
      }, {}),
    []
  );

  const unlockedSubjects = selectedSubject ? unlocksMap[selectedSubject] ?? [] : [];

  return (
    <main className="min-h-screen space-y-4 bg-slate-100 p-4 text-slate-900 md:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">Plan de Estudios · Diseño Gráfico</h1>
        <p className="text-slate-700">Hacé click en una materia para ver qué materias se desbloquean una vez aprobada.</p>
      </header>

      <section className="flex flex-wrap gap-2" aria-label="Leyenda de estados y tipos de cursado">
        <Badge variant="outline" className="border-l-[6px] border-l-blue-600">Anual</Badge>
        <Badge variant="outline" className="border-l-[6px] border-l-violet-500">Cuatrimestral 1°</Badge>
        <Badge variant="outline" className="border-l-[6px] border-l-emerald-600">Cuatrimestral 2°</Badge>
        <Badge className="border-amber-300 bg-amber-100 text-amber-900">Seleccionada</Badge>
        <Badge className="border-emerald-300 bg-emerald-100 text-emerald-900">Desbloqueada</Badge>
      </section>

      <div>
        <Button type="button" onClick={() => setSelectedSubject(null)} disabled={!selectedSubject}>
          Limpiar selección
        </Button>
      </div>

      <section
        aria-label="Materias por año"
        className="grid snap-x snap-proximity grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4 overflow-x-auto pb-1 md:auto-cols-[minmax(300px,1fr)]"
      >
        {[1, 2, 3, 4].map((year) => (
          <Card key={year} className="snap-start border-0 bg-slate-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{yearLabels[year]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2.5">
                {(subjectsByYear[year] ?? []).map((subject) => {
                  const isSelected = selectedSubject === subject.name;
                  const isUnlocked = unlockedSubjects.includes(subject.name);
                  const isDimmed = selectedSubject && !isSelected && !isUnlocked;

                  return (
                    <Button
                      key={subject.name}
                      type="button"
                      variant="outline"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedSubject((prev) => (prev === subject.name ? null : subject.name))}
                      className={cn(
                        'h-auto w-full justify-start rounded-lg border-l-[7px] p-3 text-left transition',
                        'whitespace-normal hover:-translate-y-0.5 hover:shadow-md',
                        getTypeClasses(subject),
                        isSelected && 'bg-amber-50 ring-2 ring-amber-300',
                        isUnlocked && 'border-emerald-300 bg-emerald-50',
                        isDimmed && 'opacity-45'
                      )}
                    >
                      <span className="block font-semibold leading-snug">{subject.name}</span>
                      <span className="mt-1 block text-sm">{getTypeLabel(subject)}</span>
                      <span className="mt-1 block text-xs text-slate-600">
                        Correlativas requeridas: {subject.correlatives.length}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Materia seleccionada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{selectedSubject}</p>
            <p className="mt-1 text-slate-700">
              Desbloquea: <strong>{unlockedSubjects.length}</strong> materia(s)
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
