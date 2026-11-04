import { groupTasksByLane, taskLanes, taskMove } from '@admin/tasks/model';
import { Box } from '@mui/material';
import { useState } from 'react';

import { TaskCard } from './task-card';
import { TaskLaneColumn } from './task-lane-column';

import type { TaskLane, TaskMove, TaskSummary, TaskViewer } from '@admin/tasks/model';

interface Props {
  tasks: readonly TaskSummary[];
  viewer: TaskViewer;
  showAssignee: boolean;
  onOpen: (id: number) => void;
  onMove: (task: TaskSummary, move: TaskMove) => void;
}

const emptyText: Record<TaskLane, string> = {
  Overdue: 'Нічого не прострочено',
  Urgent: 'Термінових завдань немає',
  Active: 'Немає завдань у роботі',
  Done: 'За тиждень ще нічого не виконано',
};

/**
 * «Мої завдання» board (K2): Прострочено · Терміново · У роботі · Виконано. A card is dragged
 * where `taskMove` allows; opening it gives the same actions as buttons for the keyboard.
 */
export function TaskBoard({ tasks, viewer, showAssignee, onOpen, onMove }: Props) {
  const [dragged, setDragged] = useState<TaskSummary | null>(null);
  const lanes = groupTasksByLane(tasks);
  const now = new Date();

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))',
          gap: 1.5,
          alignItems: 'start',
        }}
      >
        {taskLanes.map(({ lane, label }) => {
          const move = dragged ? taskMove(dragged, lane, viewer) : null;
          return (
            <TaskLaneColumn
              key={lane}
              lane={lane}
              label={label}
              count={lanes[lane].length}
              accepts={move !== null}
              emptyText={emptyText[lane]}
              onDrop={() => {
                if (dragged && move) onMove(dragged, move);
                setDragged(null);
              }}
            >
              {lanes[lane].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  now={now}
                  showAssignee={showAssignee}
                  dragging={dragged?.id === task.id}
                  onOpen={() => onOpen(task.id)}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', task.number);
                    setDragged(task);
                  }}
                  onDragEnd={() => setDragged(null)}
                />
              ))}
            </TaskLaneColumn>
          );
        })}
      </Box>
    </Box>
  );
}
