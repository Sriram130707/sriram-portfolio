import java.util.Arrays;

public class Main {
    static int sum(int[] numbers) {
        int total = 0;
        for (int number : numbers) total += number;
        return total;
    }

    public static void main(String[] args) {
        String studentName = "Sriram";
        int[] marks = {85, 90, 78};
        double average = (double) sum(marks) / marks.length;

        System.out.println("Name: " + studentName);
        System.out.println("Marks: " + Arrays.toString(marks));
        System.out.printf("Average: %.2f%n", average);

        if (average >= 80) System.out.println("Result: Good progress");
        else System.out.println("Result: Keep practising");
    }
}
