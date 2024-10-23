import { getTasks } from "@/actions/taskActions";
import ConfigureScheduleCycle from "./ConfigureScheduleCycle";
import { getShiftTemplates } from "@/actions/shiftTemplateActions";

export default async function ConfigureScheduleCyclePage() {
  
  const { data: taskData, error: taskError } = await getTasks();
  if (taskError) {
    console.error("Error fetching tasks:", taskError);
  }

  const { workDayTemplates: templates, error: shiftError } = await getShiftTemplates();
  if (shiftError) {
    console.error("Error fetching tasks:", shiftError);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full p-6">
        <ConfigureScheduleCycle tasks={taskData ?? []} templates={templates ?? []} />
      </div>
    </div>
  );
}

// // 'use client'

// // import React, { useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// // import { Label } from '@/components/ui/label'
// // import { Input } from '@/components/ui/input'
// // import { Progress } from '@/components/ui/progress'
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// // import { Edit2, PlusCircle, Trash } from 'lucide-react'

// // // Types
// // interface Shift {
// //   id: number
// //   title: string
// //   startTime: string
// //   endTime: string
// // }

// // interface WorkdayConfig {
// //   id: number
// //   title: string
// //   shifts: Shift[]
// // }

// // interface ShiftTaskInfo {
// //   taskId: number
// //   employeesRequired: number
// // }

// // interface ShiftWithTasks extends Shift {
// //   tasks: ShiftTaskInfo[]
// // }

// // interface WorkdayConfigWithTasks extends WorkdayConfig {
// //   shifts: ShiftWithTasks[]
// // }

// // interface Task {
// //   id: number
// //   name: string
// //   description: string
// // }

// // // Predefined workday configurations
// // const predefinedWorkdayConfigs: WorkdayConfig[] = [
// //   {
// //     id: 1,
// //     title: 'Day Work Plan 1',
// //     shifts: [
// //       { id: 1, title: 'Shift 1', startTime: '05:00', endTime: '12:00' },
// //       { id: 2, title: 'Shift 2', startTime: '12:00', endTime: '18:00' },
// //       { id: 3, title: 'Shift 3', startTime: '18:00', endTime: '23:00' },
// //     ],
// //   },
// //   {
// //     id: 2,
// //     title: 'Day Work Plan 2',
// //     shifts: [
// //       { id: 1, title: 'Shift 1', startTime: '05:00', endTime: '13:00' },
// //       { id: 2, title: 'Shift 2', startTime: '13:00', endTime: '21:00' },
// //     ],
// //   },
// // ]

// // const tasks: Task[] = [
// //   {
// //     id: 1,
// //     name: "Cooking",
// //     description: "Cooking food for the restaurant",
// //   },
// //   {
// //     id: 2,
// //     name: "Cleaning",
// //     description: "Cleaning the restaurant",
// //   },
// //   {
// //     id: 3,
// //     name: "Serving",
// //     description: "Serving food to customers",
// //   },
// // ]

// // // WorkdayConfigSelector component
// // const WorkdayConfigSelector: React.FC<{
// //   dayIndex: number
// //   config: WorkdayConfigWithTasks
// //   onChange: (config: WorkdayConfigWithTasks) => void
// // }> = ({ dayIndex, config, onChange }) => {
// //   const [shifts, setShifts] = useState<ShiftWithTasks[]>(config.shifts)
// //   const [editingShift, setEditingShift] = useState<number | null>(null)

// //   const handleSelect = (value: string) => {
// //     const selectedConfig = predefinedWorkdayConfigs.find(c => c.id === Number(value))
// //     if (selectedConfig) {
// //       const configWithTasks: WorkdayConfigWithTasks = {
// //         ...selectedConfig,
// //         shifts: selectedConfig.shifts.map(shift => ({ ...shift, tasks: [] })),
// //       }
// //       setShifts(configWithTasks.shifts)
// //       onChange(configWithTasks)
// //     }
// //   }

// //   const handleAddShift = () => {
// //     const newShift: ShiftWithTasks = {
// //       id: Date.now(),
// //       title: `New Shift`,
// //       startTime: '09:00',
// //       endTime: '17:00',
// //       tasks: []
// //     }
// //     const updatedShifts = [...shifts, newShift]
// //     setShifts(updatedShifts)
// //     onChange({ ...config, shifts: updatedShifts })
// //   }

// //   const handleRemoveShift = (shiftId: number) => {
// //     const updatedShifts = shifts.filter(shift => shift.id !== shiftId)
// //     setShifts(updatedShifts)
// //     onChange({ ...config, shifts: updatedShifts })
// //   }

// //   const handleShiftChange = (shiftId: number, field: keyof ShiftWithTasks, value: string) => {
// //     const updatedShifts = shifts.map(shift =>
// //       shift.id === shiftId ? { ...shift, [field]: value } : shift
// //     )
// //     setShifts(updatedShifts)
// //     onChange({ ...config, shifts: updatedShifts })
// //   }

// //   return (
// //     <Card className="mb-6">
// //       <CardHeader>
// //         <CardTitle>Day {dayIndex + 1} Configuration</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <Select onValueChange={handleSelect} value={String(config.id || '')}>
// //           <SelectTrigger className="w-full mb-4">
// //             <SelectValue placeholder="Select a Workday Plan" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             {predefinedWorkdayConfigs.map((option) => (
// //               <SelectItem key={option.id} value={String(option.id)}>
// //                 {option.title}
// //               </SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>

// //         {shifts.map((shift) => (
// //           <Card key={shift.id} className="mb-4 p-4">
// //             <div className="flex items-center justify-between mb-2">
// //               {editingShift === shift.id ? (
// //                 <Input
// //                   value={shift.title}
// //                   onChange={(e) => handleShiftChange(shift.id, 'title', e.target.value)}
// //                   onBlur={() => setEditingShift(null)}
// //                   className="w-1/3"
// //                 />
// //               ) : (
// //                 <div className="flex items-center">
// //                   <h3 className="text-lg font-semibold">{shift.title}</h3>
// //                   <Button variant="ghost" size="sm" onClick={() => setEditingShift(shift.id)}>
// //                     <Edit2 className="h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               )}
// //               <Button variant="destructive" size="sm" onClick={() => handleRemoveShift(shift.id)}>
// //                 <Trash className="h-4 w-4 mr-2" />
// //                 Remove
// //               </Button>
// //             </div>
// //             <div className="flex items-center space-x-4">
// //               <div className="flex-1">
// //                 <Label htmlFor={`start-time-${shift.id}`}>Start Time</Label>
// //                 <Input
// //                   id={`start-time-${shift.id}`}
// //                   type="time"
// //                   value={shift.startTime}
// //                   onChange={(e) => handleShiftChange(shift.id, 'startTime', e.target.value)}
// //                 />
// //               </div>
// //               <div className="flex-1">
// //                 <Label htmlFor={`end-time-${shift.id}`}>End Time</Label>
// //                 <Input
// //                   id={`end-time-${shift.id}`}
// //                   type="time"
// //                   value={shift.endTime}
// //                   onChange={(e) => handleShiftChange(shift.id, 'endTime', e.target.value)}
// //                 />
// //               </div>
// //             </div>
// //           </Card>
// //         ))}
// //         <Button onClick={handleAddShift} className="w-full">
// //           <PlusCircle className="h-4 w-4 mr-2" />
// //           Add Shift
// //         </Button>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// // const ShiftTaskConfigurator: React.FC<{
// //   dayIndex: number
// //   shiftIndex: number
// //   shift: ShiftWithTasks
// //   onChange: (shift: ShiftWithTasks) => void
// // }> = ({ shift, onChange }) => {
// //   const [shiftTasks, setShiftTasks] = useState<ShiftTaskInfo[]>(shift.tasks || [])

// //   const handleAddTask = () => {
// //     const newTask: ShiftTaskInfo = { taskId: tasks[0].id, employeesRequired: 1 }
// //     const updatedTasks = [...shiftTasks, newTask]
// //     setShiftTasks(updatedTasks)
// //     onChange({ ...shift, tasks: updatedTasks })
// //   }

// //   const handleTaskChange = (index: number, field: 'taskId' | 'employeesRequired', value: any) => {
// //     const updatedTasks = shiftTasks.map((task, idx) =>
// //       idx === index ? { ...task, [field]: value } : task
// //     )
// //     setShiftTasks(updatedTasks)
// //     onChange({ ...shift, tasks: updatedTasks })
// //   }

// //   const handleRemoveTask = (index: number) => {
// //     const updatedTasks = shiftTasks.filter((_, idx) => idx !== index)
// //     setShiftTasks(updatedTasks)
// //     onChange({ ...shift, tasks: updatedTasks })
// //   }

// //   return (
// //     <div className="border p-4 rounded-md mt-4">
// //       <h4 className="text-md font-medium mb-2">
// //         {shift.title}: {shift.startTime} - {shift.endTime}
// //       </h4>
// //       {shiftTasks.map((task, index) => (
// //         <div key={index} className="flex items-center gap-2 mb-2">
// //           <Select
// //             value={task.taskId.toString()}
// //             onValueChange={(value) => handleTaskChange(index, 'taskId', parseInt(value))}
// //           >
// //             <SelectTrigger className="w-[180px]">
// //               <SelectValue placeholder="Select a task" />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {tasks.map((demoTask) => (
// //                 <SelectItem key={demoTask.id} value={demoTask.id.toString()}>
// //                   {demoTask.name}
// //                 </SelectItem>
// //               ))}
// //             </SelectContent>
// //           </Select>
// //           <Input
// //             type="number"
// //             placeholder="Employees Required"
// //             value={task.employeesRequired}
// //             min={1}
// //             onChange={(e) => handleTaskChange(index, 'employeesRequired', Number(e.target.value))}
// //             className="w-32"
// //           />
// //           <Button variant="destructive" onClick={() => handleRemoveTask(index)}>
// //             <Trash className="h-4 w-4" />
// //           </Button>
// //         </div>
// //       ))}
// //       <Button variant="secondary" onClick={handleAddTask}>
// //         Add Task
// //       </Button>
// //     </div>
// //   )
// // }

// // // Main ConfigureScheduleCycle component
// // const ConfigureScheduleCycle: React.FC = () => {
// //   const router = useRouter()
// //   const [step, setStep] = useState<number>(1)
// //   const [cycleDays, setCycleDays] = useState<number>(7)
// //   const [workdayConfigs, setWorkdayConfigs] = useState<WorkdayConfigWithTasks[]>([])
// //   const [errors, setErrors] = useState<{ [key: string]: string }>({})

// //   const handleNext = () => {
// //     if (step === 1) {
// //       if (cycleDays < 1) {
// //         setErrors({ cycleDays: 'Cycle duration must be at least 1 day.' })
// //         return
// //       }
// //       const initialConfigs = Array.from({ length: cycleDays }, (_, index) => ({
// //         id: index + 1,
// //         title: `Day ${index + 1}`,
// //         shifts: [],
// //       }))
// //       setWorkdayConfigs(initialConfigs)
// //     }
// //     setErrors({})
// //     setStep((prev) => prev + 1)
// //   }

// //   const handleBack = () => {
// //     setErrors({})
// //     setStep((prev) => prev - 1)
// //   }

// //   const handleSubmit = () => {
// //     console.log('Configuration saved:', workdayConfigs)
// //     router.push('/schedule-cycles')
// //   }

// //   return (
// //     <Card className="max-w-4xl mx-auto mt-10">
// //       <CardHeader>
// //         <CardTitle>Configure Schedule Cycle</CardTitle>
// //         <CardDescription>
// //           {step === 1 && 'Step 1: Specify the cycle duration.'}
// //           {step === 2 && 'Step 2: Select workday plans for each day.'}
// //           {step === 3 && 'Step 3: Assign tasks to each shift.'}
// //         </CardDescription>
// //       </CardHeader>
// //       <CardContent>
// //         <Progress value={(step / 3) * 100} className="mb-4" />

// //         {step === 1 && (
// //           <div className="space-y-4">
// //             <Label htmlFor="cycleDays">Number of Days in Cycle</Label>
// //             <Input
// //               id="cycleDays"
// //               type="number"
// //               value={cycleDays}
// //               onChange={(e) => setCycleDays(Number(e.target.value))}
// //               min={1}
// //             />
// //             {errors.cycleDays && (
// //               <p className="text-red-500 text-sm">{errors.cycleDays}</p>
// //             )}
// //           </div>
// //         )}

// //         {step === 2 && (
// //           <div className="space-y-6">
// //             {workdayConfigs.map((config, index) => (
// //               <WorkdayConfigSelector
// //                 key={config.id}
// //                 dayIndex={index}
// //                 config={config}
// //                 onChange={(updatedConfig) => {
// //                   const newConfigs = [...workdayConfigs]
// //                   newConfigs[index] = updatedConfig
// //                   setWorkdayConfigs(newConfigs)
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         )}

// //         {step === 3 && (
// //           <div className="space-y-6">
// //             {workdayConfigs.map((config, dayIndex) => (
// //               <div key={config.id}>
// //                 <h3 className="text-lg font-medium mb-2">
// //                   Day {dayIndex + 1}: {config.title}
// //                 </h3>
// //                 {config.shifts.map((shift, shiftIndex) => (
// //                   <ShiftTaskConfigurator
// //                     key={shift.id}
// //                     dayIndex={dayIndex}
// //                     shiftIndex={shiftIndex}
// //                     shift={shift}
// //                     onChange={(updatedShift) => {
// //                       const newConfigs = [...workdayConfigs]
// //                       newConfigs[dayIndex].shifts[shiftIndex] = updatedShift
// //                       setWorkdayConfigs(newConfigs)
// //                     }}
// //                   />
// //                 ))}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </CardContent>
// //       <CardFooter className="flex justify-between">
// //         {step > 1 && (
// //           <Button variant="secondary" onClick={handleBack}>
// //             Back
// //           </Button>
// //         )}
// //         {step < 3 && (
// //           <Button onClick={handleNext}>
// //             Next
// //           </Button>
// //         )}
// //         {step === 3 && (
// //           <Button onClick={handleSubmit}>
// //             Save Configuration
// //           </Button>
// //         )}
// //       </CardFooter>
// //     </Card>
// //   )
// // }

// // export default ConfigureScheduleCycle

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Edit2, PlusCircle, Trash } from "lucide-react";
// import WorkdayConfigSelectorCalender from "./WorkdayConfigSelectorCalender";

// // Types
// interface Shift {
//   id: number;
//   title: string;
//   startTime: string;
//   endTime: string;
// }

// interface ShiftTaskInfo {
//   taskId: number;
//   employeesRequired: number;
// }

// interface ShiftWithTasks extends Shift {
//   tasks: ShiftTaskInfo[];
// }

// interface WorkdayConfig {
//   id: number;
//   title: string;
//   shifts: Shift[];
// }

// interface WorkdayConfigWithTasks extends WorkdayConfig {
//   shifts: ShiftWithTasks[];
// }

// interface Task {
//   id: number;
//   name: string;
//   description: string;
// }

// // Predefined workday configurations
// const predefinedWorkdayConfigs: WorkdayConfig[] = [
//   {
//     id: 1,
//     title: "Day Work Plan 1",
//     shifts: [
//       { id: 1, title: "Shift 1", startTime: "05:00", endTime: "12:00" },
//       { id: 2, title: "Shift 2", startTime: "12:00", endTime: "18:00" },
//       { id: 3, title: "Shift 3", startTime: "18:00", endTime: "23:00" },
//     ],
//   },
//   {
//     id: 2,
//     title: "Day Work Plan 2",
//     shifts: [
//       { id: 1, title: "Shift 1", startTime: "05:00", endTime: "13:00" },
//       { id: 2, title: "Shift 2", startTime: "13:00", endTime: "21:00" },
//     ],
//   },
// ];

// // Tasks
// const tasks: Task[] = [
//   {
//     id: 1,
//     name: "Cooking",
//     description: "Cooking food for the restaurant",
//   },
//   {
//     id: 2,
//     name: "Cleaning",
//     description: "Cleaning the restaurant",
//   },
//   {
//     id: 3,
//     name: "Serving",
//     description: "Serving food to customers",
//   },
// ];

// //
// // WorkdayConfigSelector Component
// //
// interface WorkdayConfigSelectorProps {
//   dayIndex: number;
//   config: WorkdayConfigWithTasks;
//   onChange: (config: WorkdayConfigWithTasks) => void;
// }

// const WorkdayConfigSelector: React.FC<WorkdayConfigSelectorProps> = ({
//   dayIndex,
//   config,
//   onChange,
// }) => {
//   const [shifts, setShifts] = useState<ShiftWithTasks[]>(config.shifts || []);
//   const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

//   // Synchronize shifts state when config.shifts changes
//   useEffect(() => {
//     setShifts(config.shifts || []);
//   }, [config.shifts]);

//   // Handle selection of a predefined workday plan
//   const handleSelect = (value: string) => {
//     const selectedConfig = predefinedWorkdayConfigs.find(
//       (c) => c.id === Number(value)
//     );
//     if (selectedConfig) {
//       const configWithTasks: WorkdayConfigWithTasks = {
//         ...selectedConfig,
//         shifts: selectedConfig.shifts.map((shift) => ({
//           ...shift,
//           tasks: [],
//         })),
//       };
//       setShifts(configWithTasks.shifts);
//       onChange(configWithTasks);
//     }
//   };

//   // Handle adding a new shift
//   const handleAddShift = () => {
//     const newShift: ShiftWithTasks = {
//       id: Date.now(),
//       title: "New Shift",
//       startTime: "09:00",
//       endTime: "17:00",
//       tasks: [],
//     };
//     const updatedShifts = [...shifts, newShift];
//     setShifts(updatedShifts);
//     onChange({ ...config, shifts: updatedShifts });
//   };

//   // Handle removing a shift
//   const handleRemoveShift = (shiftId: number) => {
//     const updatedShifts = shifts.filter((shift) => shift.id !== shiftId);
//     setShifts(updatedShifts);
//     onChange({ ...config, shifts: updatedShifts });
//   };

//   // Handle changes to shift details
//   const handleShiftChange = (
//     shiftId: number,
//     field: keyof ShiftWithTasks,
//     value: string
//   ) => {
//     const updatedShifts = shifts.map((shift) =>
//       shift.id === shiftId ? { ...shift, [field]: value } : shift
//     );
//     setShifts(updatedShifts);
//     onChange({ ...config, shifts: updatedShifts });
//   };

//   return (
//     <Card className="mb-6">
//       <CardHeader>
//         <CardTitle>Day {dayIndex + 1} Configuration</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Label>Select a Workday Plan</Label>
//         <div className="w-full mb-4">
//           <Select onValueChange={handleSelect} value={String(config.id || "")}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a Workday Plan" />
//             </SelectTrigger>
//             <SelectContent>
//               {predefinedWorkdayConfigs.map((option) => (
//                 <SelectItem key={option.id} value={String(option.id)}>
//                   {option.title}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {shifts.map((shift) => (
//           <Card key={shift.id} className="mb-4 p-4">
//             <div className="flex items-center justify-between mb-2">
//               {editingShiftId === shift.id ? (
//                 <Input
//                   value={shift.title}
//                   onChange={(e) =>
//                     handleShiftChange(shift.id, "title", e.target.value)
//                   }
//                   onBlur={() => setEditingShiftId(null)}
//                   className="w-1/3"
//                 />
//               ) : (
//                 <div className="flex items-center">
//                   <h3 className="text-lg font-semibold">{shift.title}</h3>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setEditingShiftId(shift.id)}
//                   >
//                     <Edit2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => handleRemoveShift(shift.id)}
//               >
//                 <Trash className="h-4 w-4 mr-2" />
//                 Remove
//               </Button>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex-1">
//                 <Label htmlFor={`start-time-${shift.id}`}>Start Time</Label>
//                 <Input
//                   id={`start-time-${shift.id}`}
//                   type="time"
//                   value={shift.startTime}
//                   onChange={(e) =>
//                     handleShiftChange(shift.id, "startTime", e.target.value)
//                   }
//                 />
//               </div>
//               <div className="flex-1">
//                 <Label htmlFor={`end-time-${shift.id}`}>End Time</Label>
//                 <Input
//                   id={`end-time-${shift.id}`}
//                   type="time"
//                   value={shift.endTime}
//                   onChange={(e) =>
//                     handleShiftChange(shift.id, "endTime", e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//         {/* <Button onClick={handleAddShift} className="w-full">
//           <PlusCircle className="h-4 w-4 mr-2" />
//           Add Shift
//         </Button> */}
//       </CardContent>
//     </Card>
//   );
// };

// //
// // ShiftTaskConfigurator Component
// //
// interface ShiftTaskConfiguratorProps {
//   dayIndex: number;
//   shiftIndex: number;
//   shift: ShiftWithTasks;
//   onChange: (shift: ShiftWithTasks) => void;
// }

// const ShiftTaskConfigurator: React.FC<ShiftTaskConfiguratorProps> = ({
//   shift,
//   onChange,
// }) => {
//   const [shiftTasks, setShiftTasks] = useState<ShiftTaskInfo[]>(
//     shift.tasks || []
//   );

//   // Synchronize shiftTasks state when shift.tasks changes
//   useEffect(() => {
//     setShiftTasks(shift.tasks || []);
//   }, [shift.tasks]);

//   const handleAddTask = () => {
//     const newTask: ShiftTaskInfo = {
//       taskId: tasks[0].id,
//       employeesRequired: 1,
//     };
//     const updatedTasks = [...shiftTasks, newTask];
//     setShiftTasks(updatedTasks);
//     onChange({ ...shift, tasks: updatedTasks });
//   };

//   const handleTaskChange = (
//     index: number,
//     field: keyof ShiftTaskInfo,
//     value: any
//   ) => {
//     const updatedTasks = shiftTasks.map((task, idx) =>
//       idx === index ? { ...task, [field]: value } : task
//     );
//     setShiftTasks(updatedTasks);
//     onChange({ ...shift, tasks: updatedTasks });
//   };

//   const handleRemoveTask = (index: number) => {
//     const updatedTasks = shiftTasks.filter((_, idx) => idx !== index);
//     setShiftTasks(updatedTasks);
//     onChange({ ...shift, tasks: updatedTasks });
//   };

//   return (
//     <div className="border p-4 rounded-md mt-4">
//       <h4 className="text-md font-medium mb-2">
//         {shift.title}: {shift.startTime} - {shift.endTime}
//       </h4>
//       {shiftTasks.map((task, index) => (
//         <div key={index} className="flex items-center gap-2 mb-2">
//           <Select
//             value={task.taskId.toString()}
//             onValueChange={(value) =>
//               handleTaskChange(index, "taskId", parseInt(value))
//             }
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select a task" />
//             </SelectTrigger>
//             <SelectContent>
//               {tasks.map((demoTask) => (
//                 <SelectItem key={demoTask.id} value={demoTask.id.toString()}>
//                   {demoTask.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Input
//             type="number"
//             placeholder="Employees Required"
//             value={task.employeesRequired}
//             min={1}
//             onChange={(e) =>
//               handleTaskChange(index, "employeesRequired", Number(e.target.value))
//             }
//             className="w-32"
//           />
//           <Button
//             variant="destructive"
//             onClick={() => handleRemoveTask(index)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         </div>
//       ))}
//       <Button variant="secondary" onClick={handleAddTask}>
//         Add Task
//       </Button>
//     </div>
//   );
// };

// //
// // ConfigureScheduleCycle Component
// //
// const ConfigureScheduleCycle: React.FC = () => {
//   const router = useRouter();
//   const [step, setStep] = useState<number>(1);
//   const [cycleDays, setCycleDays] = useState<number>(7);
//   const [workdayConfigs, setWorkdayConfigs] = useState<
//     WorkdayConfigWithTasks[]
//   >([]);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleNext = () => {
//     if (step === 1) {
//       if (cycleDays < 1) {
//         setErrors({ cycleDays: "Cycle duration must be at least 1 day." });
//         return;
//       }
//       const initialConfigs: WorkdayConfigWithTasks[] = Array.from(
//         { length: cycleDays },
//         (_, index) => ({
//           id: index + 1,
//           title: `Day ${index + 1}`,
//           shifts: [],
//         })
//       );
//       setWorkdayConfigs(initialConfigs);
//     }
//     setErrors({});
//     setStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setErrors({});
//     setStep((prev) => prev - 1);
//   };

//   const handleSubmit = () => {
//     console.log("Configuration saved:", workdayConfigs);
//     // Implement actual saving logic here
//     router.push("/schedule-cycles");
//   };

//   return (
//     <Card className="max-w-4xl mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>Configure Schedule Cycle</CardTitle>
//         <CardDescription>
//           {step === 1 && "Step 1: Specify the cycle duration."}
//           {step === 2 && "Step 2: Select workday plans for each day."}
//           {step === 3 && "Step 3: Assign tasks to each shift."}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>

//         {/* <WorkdayConfigSelectorCalender
//           dayIndex={0}
//           config={{
//             id: 1,
//             title: "Day 1",
//             shifts: []
//           }}
//           onChange={(config: WorkdayConfigWithTasks) => {
//             // Implement the onChange logic here
//             console.log("WorkdayConfigSelectorCalender changed:", config);
//           }}
//         /> */}

//         <Progress value={(step / 3) * 100} className="mb-4" />

//         {step === 1 && (
//           <div className="space-y-4">
//             <Label htmlFor="cycleDays">Number of Days in Cycle</Label>
//             <Input
//               id="cycleDays"
//               type="number"
//               value={cycleDays}
//               onChange={(e) => setCycleDays(Number(e.target.value))}
//               min={1}
//             />
//             {errors.cycleDays && (
//               <p className="text-red-500 text-sm">{errors.cycleDays}</p>
//             )}
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-6">
//             {workdayConfigs.map((config, index) => (
//               <WorkdayConfigSelector
//                 key={config.id}
//                 dayIndex={index}
//                 config={config}
//                 onChange={(updatedConfig) => {
//                   const newConfigs = [...workdayConfigs];
//                   newConfigs[index] = updatedConfig;
//                   setWorkdayConfigs(newConfigs);
//                 }}
//               />
//             ))}
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-6">
//             {workdayConfigs.map((config, dayIndex) => (
//               <div key={config.id}>
//                 <h3 className="text-lg font-medium mb-2">
//                   Day {dayIndex + 1}: {config.title}
//                 </h3>
//                 {config.shifts.map((shift, shiftIndex) => (
//                   <ShiftTaskConfigurator
//                     key={shift.id}
//                     dayIndex={dayIndex}
//                     shiftIndex={shiftIndex}
//                     shift={shift}
//                     onChange={(updatedShift) => {
//                       const newConfigs = [...workdayConfigs];
//                       newConfigs[dayIndex].shifts[shiftIndex] = updatedShift;
//                       setWorkdayConfigs(newConfigs);
//                     }}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         {step > 1 && (
//           <Button variant="secondary" onClick={handleBack}>
//             Back
//           </Button>
//         )}
//         {step < 3 && (
//           <Button onClick={handleNext}>
//             Next
//           </Button>
//         )}
//         {step === 3 && (
//           <Button onClick={handleSubmit}>
//             Save Configuration
//           </Button>
//         )}
//       </CardFooter>
//       <WorkdayConfigSelectorCalender dayIndex={0} config={workdayConfigs} onChange={function (config: WorkdayConfigWithTasks): void {
//         throw new Error("Function not implemented.");
//       } } />
//     </Card>
//   );
// };
// export default ConfigureScheduleCycle;
