import EmployeeShiftAvailabilityPage from "./EmployeeShiftAvailabilityPage";

export default function ConfigureScheduleCyclePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full p-6">
        <EmployeeShiftAvailabilityPage shiftCycle={dummy}/>
      </div>
    </div>
  )
}


const dummy = {
  "id": "af3e70ba-bc29-4278-99d3-044fd58d1022",
  "title": "Sequential Shift Cycle",
  "numWorkDays": 8,
  "startDate": "2024-10-08",
  "endDate": "2024-10-15",
  "workdays": [
    {
      "id": "9f77e763-7cb3-41fc-bb6f-9f23c1332b9a",
      "title": "Workday 1",
      "date": "2024-10-08",
      "startTime": "08:00",
      "endTime": "22:00",
      "shifts": [
        {
          "id": "7baec708-89db-47c2-bcdc-fa3739f1b062",
          "duration": 2,
          "startTime": "08:00",
          "endTime": "10:00",
          "title": "Shift 88"
        },
        {
          "id": "a938a860-2b6b-45f2-890f-2a8a64aabc15",
          "duration": 4,
          "startTime": "10:00",
          "endTime": "14:00",
          "title": "Shift 35"
        },
        {
          "id": "382d0eff-0044-4dcb-b944-b8d007f226f3",
          "duration": 4,
          "startTime": "14:00",
          "endTime": "18:00",
          "title": "Shift 68"
        },
        {
          "id": "6ffa53c6-9489-4af0-9653-fbc0fcacb43c",
          "duration": 4,
          "startTime": "18:00",
          "endTime": "22:00",
          "title": "Shift 71"
        }
      ]
    },
    {
      "id": "e5f32b0c-4734-42bc-b797-c771b3e1e1fa",
      "title": "Workday 2",
      "date": "2024-10-09",
      "startTime": "08:00",
      "endTime": "17:00",
      "shifts": [
        {
          "id": "9c8ea4cc-a84c-49ae-bb6c-57685a2cecda",
          "duration": 4,
          "startTime": "08:00",
          "endTime": "12:00",
          "title": "Shift 93"
        },
        {
          "id": "e0fdfb37-9a37-4b9f-9ac0-c435d9c3cb83",
          "duration": 3,
          "startTime": "12:00",
          "endTime": "15:00",
          "title": "Shift 26"
        },
        {
          "id": "f40fcb26-dba7-4650-9df5-8fb54121c440",
          "duration": 2,
          "startTime": "15:00",
          "endTime": "17:00",
          "title": "Shift 26"
        }
      ]
    },
    {
      "id": "d966d7a2-8d63-4c3f-9108-13ba2836ff91",
      "title": "Workday 3",
      "date": "2024-10-10",
      "startTime": "08:00",
      "endTime": "17:00",
      "shifts": [
        {
          "id": "f1d6308e-7951-415b-94ce-8c8cc1219b68",
          "duration": 3,
          "startTime": "08:00",
          "endTime": "11:00",
          "title": "Shift 61"
        },
        {
          "id": "8c7a2a73-70a8-4c1c-90d0-c59600d2edc0",
          "duration": 2,
          "startTime": "11:00",
          "endTime": "13:00",
          "title": "Shift 59"
        },
        {
          "id": "7e078c1b-5744-45ea-a33e-d1a3a8e9d6fc",
          "duration": 4,
          "startTime": "13:00",
          "endTime": "17:00",
          "title": "Shift 56"
        }
      ]
    },
    {
      "id": "1936218c-78a7-4237-8ad8-28817315f69f",
      "title": "Workday 4",
      "date": "2024-10-11",
      "startTime": "08:00",
      "endTime": "04:00",
      "shifts": [
        {
          "id": "d588644f-422b-438e-b85f-e61f1bf9901c",
          "duration": 5,
          "startTime": "08:00",
          "endTime": "13:00",
          "title": "Shift 76"
        },
        {
          "id": "6aace2c1-a152-43eb-bb77-71ea1a262bf2",
          "duration": 3,
          "startTime": "13:00",
          "endTime": "16:00",
          "title": "Shift 26"
        },
        {
          "id": "61643895-5d97-480a-a699-04e58e0d8eb0",
          "duration": 2,
          "startTime": "16:00",
          "endTime": "18:00",
          "title": "Shift 18"
        },
        {
          "id": "87a6cac8-a154-49e3-b655-7eaebae6267a",
          "duration": 5,
          "startTime": "18:00",
          "endTime": "23:00",
          "title": "Shift 83"
        },
        {
          "id": "5e6758c6-cd18-48bb-a164-14a0ba328dfb",
          "duration": 5,
          "startTime": "23:00",
          "endTime": "04:00",
          "title": "Shift 89"
        }
      ]
    },
    {
      "id": "7c7b4522-83e0-43da-9bf5-1d5e670f4e02",
      "title": "Workday 5",
      "date": "2024-10-12",
      "startTime": "08:00",
      "endTime": "20:00",
      "shifts": [
        {
          "id": "67df7846-3087-43a4-a595-3442197ddf68",
          "duration": 5,
          "startTime": "08:00",
          "endTime": "13:00",
          "title": "Shift 41"
        },
        {
          "id": "de5747b7-1e4c-4bf0-b372-6ceeca5f98da",
          "duration": 5,
          "startTime": "13:00",
          "endTime": "18:00",
          "title": "Shift 69"
        },
        {
          "id": "e43d469a-7db7-4236-ba42-d58cde8bf74d",
          "duration": 2,
          "startTime": "18:00",
          "endTime": "20:00",
          "title": "Shift 32"
        }
      ]
    },
    {
      "id": "82889782-4d9d-440b-8d98-ada41a6799e5",
      "title": "Workday 6",
      "date": "2024-10-13",
      "startTime": "08:00",
      "endTime": "17:00",
      "shifts": [
        {
          "id": "3b7abd1b-d8e6-42dd-a146-d6bbd7bbdfeb",
          "duration": 4,
          "startTime": "08:00",
          "endTime": "12:00",
          "title": "Shift 5"
        },
        {
          "id": "9fc37bf3-54db-4897-9d43-92cdf56afe20",
          "duration": 5,
          "startTime": "12:00",
          "endTime": "17:00",
          "title": "Shift 20"
        }
      ]
    },
    {
      "id": "1d54d1e8-a9d8-4000-b0bd-12a25904053d",
      "title": "Workday 7",
      "date": "2024-10-14",
      "startTime": "08:00",
      "endTime": "00:00",
      "shifts": [
        {
          "id": "3e911e62-10d8-48ff-922e-af98e2575888",
          "duration": 4,
          "startTime": "08:00",
          "endTime": "12:00",
          "title": "Shift 28"
        },
        {
          "id": "301d5617-04c9-48db-a73f-fb31abe5ff07",
          "duration": 2,
          "startTime": "12:00",
          "endTime": "14:00",
          "title": "Shift 86"
        },
        {
          "id": "0120acc7-60f2-4ff8-992d-b603e19f2626",
          "duration": 3,
          "startTime": "14:00",
          "endTime": "17:00",
          "title": "Shift 22"
        },
        {
          "id": "d072b9ec-4451-4d74-947e-f286139e8ff3",
          "duration": 4,
          "startTime": "17:00",
          "endTime": "21:00",
          "title": "Shift 60"
        },
        {
          "id": "8ddb05e8-f69e-4042-9182-1c308a0d3e89",
          "duration": 3,
          "startTime": "21:00",
          "endTime": "00:00",
          "title": "Shift 84"
        }
      ]
    },
    {
      "id": "d2b34b21-af2d-4732-9642-1742c03619ac",
      "title": "Workday 8",
      "date": "2024-10-15",
      "startTime": "08:00",
      "endTime": "23:00",
      "shifts": [
        {
          "id": "499d2483-4d6b-4675-ad28-0ce27184f4f2",
          "duration": 3,
          "startTime": "08:00",
          "endTime": "11:00",
          "title": "Shift 63"
        },
        {
          "id": "baeb2060-d395-4a13-9c6e-f4e5514cc955",
          "duration": 4,
          "startTime": "11:00",
          "endTime": "15:00",
          "title": "Shift 87"
        },
        {
          "id": "5e9637ac-eede-4cde-95ed-ae446bb596ee",
          "duration": 5,
          "startTime": "15:00",
          "endTime": "20:00",
          "title": "Shift 38"
        },
        {
          "id": "ca972c87-eb84-4b27-88ee-f3e7f2c9c62d",
          "duration": 3,
          "startTime": "20:00",
          "endTime": "23:00",
          "title": "Shift 45"
        }
      ]
    }
  ]
}