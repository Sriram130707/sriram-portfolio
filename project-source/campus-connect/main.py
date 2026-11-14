import json
from pathlib import Path

DATA_FILE = Path(__file__).with_name("students.json")

def load_students():
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []

def save_students(students):
    DATA_FILE.write_text(json.dumps(students, indent=2), encoding="utf-8")

def add_student(students):
    name = input("Student name: ").strip()
    student_id = input("Student ID: ").strip()
    email = input("Email: ").strip()
    if not name or not student_id or not email:
        print("All fields are required.")
        return
    if any(s["student_id"].lower() == student_id.lower() for s in students):
        print("That student ID already exists.")
        return
    students.append({"name": name, "student_id": student_id, "email": email})
    save_students(students)
    print("Student added successfully.")

def list_students(students):
    if not students:
        print("No student records found.")
        return
    for student in students:
        print(f'{student["student_id"]} | {student["name"]} | {student["email"]}')

def search_student(students):
    query = input("Enter student name or ID: ").strip().lower()
    matches = [s for s in students if query in s["name"].lower() or query in s["student_id"].lower()]
    if not matches:
        print("No matching student found.")
    else:
        list_students(matches)

def remove_student(students):
    student_id = input("Student ID to remove: ").strip().lower()
    updated = [s for s in students if s["student_id"].lower() != student_id]
    if len(updated) == len(students):
        print("Student ID not found.")
        return
    save_students(updated)
    print("Student removed.")

def main():
    students = load_students()
    actions = {"1": add_student, "2": list_students, "3": search_student, "4": remove_student}
    while True:
        print("\n=== Campus Connect ===\n1. Add student\n2. View students\n3. Search student\n4. Remove student\n5. Exit")
        choice = input("Choose an option: ").strip()
        if choice == "5":
            print("Goodbye!")
            break
        action = actions.get(choice)
        if action:
            action(students)
            students = load_students()
        else:
            print("Please choose a valid option.")

if __name__ == "__main__":
    main()
