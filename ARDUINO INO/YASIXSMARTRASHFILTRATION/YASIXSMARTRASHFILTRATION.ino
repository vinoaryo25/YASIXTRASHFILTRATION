#include <Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;

void setup() {
  Serial.begin(9600);
  servo1.attach(3);
  servo2.attach(5);
  servo3.attach(6);

  // Initialize all servos to center
  servo1.write(90);
  servo2.write(90);
  servo3.write(90);

  Serial.println("WELCOME TO YASIX SMART TRASH FILTRATION!");
}


void loop() {

  if (Serial.available() > 0) {
    char signal = Serial.read();

    switch (signal) {
      case 'A':
        openA(180);
        Serial.println("A: Servo 1 activated");

        break;
      case 'B':
        openB(180);
        Serial.println("B: Servo 2 activated");
        break;
      case 'C':
        openC(180);
        Serial.println("C: Servo 3 activated");
        break;
    }
  }
}

int OPEN_TIME = 3000;

void openA(int degree) {
  servo1.write(degree);
  digitalWrite(13, HIGH);
  delay(OPEN_TIME);
  digitalWrite(13, LOW);
  servo1.write(90);
}

void openB(int degree) {
  servo2.write(degree);
  digitalWrite(13, HIGH);
  delay(OPEN_TIME);
  digitalWrite(13, LOW);
  servo2.write(90);
}

void openC(int degree) {
  servo3.write(degree);
  digitalWrite(13, HIGH);
  delay(OPEN_TIME);
  digitalWrite(13, LOW);
  servo3.write(90);
}