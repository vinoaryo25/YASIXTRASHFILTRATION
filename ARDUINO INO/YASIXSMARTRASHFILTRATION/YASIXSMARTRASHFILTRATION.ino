#include <Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;

int BUZZER = 8;


void setup() {
  Serial.begin(9600);

  pinMode(BUZZER, OUTPUT);

  servo1.attach(3);
  servo2.attach(5);
  servo3.attach(6);

  servo1.write(90);
  servo2.write(90);
  servo3.write(90);

  beep();

  Serial.println("WELCOME TO YASIX SMART TRASH FILTRATION!");
}


void loop() {

  if (Serial.available() > 0) {
    char signal = Serial.read();

    switch (signal) {
      case 'A':
        check();
        openA(180);
        Serial.println("A: Servo 1 activated");
        break;
      case 'B':
        check();
        openB(180);
        Serial.println("B: Servo 2 activated");
        break;
      case 'C':
        check();
        openC(180);
        Serial.println("C: Servo 3 activated");
        break;
    }
  }
}
int OPEN_TIME = 3000;

int length = 8;
char notes[] = "cdefgabCCbagfedc";
int beats[] = {
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  4,
};
int tempo = 50;

void playTone(int tone, int duration) {
  for (long i = 0; i < duration * 1000L; i += tone * 2) {
    digitalWrite(BUZZER, HIGH);
    delayMicroseconds(tone);
    digitalWrite(BUZZER, LOW);
    delayMicroseconds(tone);
  }
}

void playNote(char note, int duration) {
  char names[] = { 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'C' };
  int tones[] = { 1915, 1700, 1519, 1432, 1275, 1136, 1014, 956 };

  // play the tone corresponding to the note name
  for (int i = 0; i < 8; i++) {
    if (names[i] == note) {
      playTone(tones[i], duration);
    }
  }
}

void check() {
  // B5 note (988 Hz) for 100ms
  tone(BUZZER, 988, 100);
  delay(100);
  // E6 note (1319 Hz) for 400ms
  tone(BUZZER, 1319, 400);
  delay(400);
  noTone(BUZZER);
}

void beep() {
  for (int i = 0; i < length; i++) {
    if (notes[i] == ' ') {
      delay(beats[i] * tempo);  // rest
    } else {
      playNote(notes[i], beats[i] * tempo);
    }
    // pause between notes
    delay(tempo / 2);
  }
}

void openA(int degree) {
  servo1.write(degree);
  delay(OPEN_TIME);
  servo1.write(90);
}

void openB(int degree) {
  servo2.write(degree);
  delay(OPEN_TIME);
  servo2.write(90);
}

void openC(int degree) {
  servo3.write(degree);
  delay(OPEN_TIME);
  servo3.write(90);
}