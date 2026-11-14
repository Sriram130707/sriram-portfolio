class Student {
    private final String name;
    private final int rollNumber;

    Student(String name, int rollNumber) {
        this.name = name;
        this.rollNumber = rollNumber;
    }

    public String getName() { return name; }
    public int getRollNumber() { return rollNumber; }
}

class GraduateStudent extends Student {
    private final String specialization;

    GraduateStudent(String name, int rollNumber, String specialization) {
        super(name, rollNumber);
        this.specialization = specialization;
    }

    public void display() {
        System.out.println("Name: " + getName());
        System.out.println("Roll number: " + getRollNumber());
        System.out.println("Specialization: " + specialization);
    }
}

public class Main {
    public static void main(String[] args) {
        GraduateStudent student = new GraduateStudent("Sriram", 101, "AI & ML");
        student.display();
    }
}
