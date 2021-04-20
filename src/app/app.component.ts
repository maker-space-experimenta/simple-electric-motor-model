import { Project, Path } from 'paper';
import * as paper from 'paper';

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color, Group, Point, Shape, Size } from 'paper/dist/paper-core';
import { ParsedProperty } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'simple-electric-motor';

  @ViewChild('myCanvas') canvas: ElementRef<HTMLCanvasElement>;
  private cx: CanvasRenderingContext2D;

  private interval: number = null;

  private paperProject: paper.Project;

  private rotor: paper.Group;

  public motor_center = new Point(200, 200);
  public coils: paper.Group[] = [];
  public position: number = 0;
  public count_coils = 6;
  public direction = 1;

  constructor() { }

  public ngAfterViewInit() {

    window['paper'] = paper;

    console.log("init");
    console.log("screen width: " + window.innerWidth);

    this.paperProject = new Project("myCanvas");

    // let border_witdth = parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.2;
    // let scale = (window.innerWidth - (2 * border_witdth)) / 1080;
    // this.canvas.nativeElement.style.transform = "scale(" + scale.toString() + ")";


    this.drawMotor(this.motor_center);

    this.rotor.rotate((360 / this.count_coils) * 3);

    this.startTimer();
  }

  public drawMotor(motor_position: paper.Point) {
    var shape = new Shape.Circle({ center: motor_position, radius: 150, project: this.paperProject });
    shape.strokeColor = new Color("black");

    for (var i = 0; i < this.count_coils; i++) {
      var positive = new Shape.Circle({
        center: motor_position.add(new Point(130, 0)),
        radius: 10,
        strokeColor: new Color("black"),
        project: this.paperProject,
      });

      var negative = new Shape.Circle({
        center: motor_position.add(new Point(-130, 0)),
        radius: 10,
        strokeColor: new Color("black"),
        project: this.paperProject
      });

      this.coils[i] = new Group({
        children: [positive, negative],
        project: this.paperProject
      });
      this.coils[i].rotate(i * (180 / this.count_coils));
    }

    var rotor_positive = new Shape.Rectangle({
      center: motor_position.subtract(new Point(55, 0)),
      size: new Size(110, 20),
      strokeColor: new Color("red"),
      fillColor: new Color("red"),
      project: this.paperProject,
    });
    var rotor_negative = new Shape.Rectangle({
      center: motor_position.add(new Point(55, 0)),
      size: new Size(110, 20),
      strokeColor: new Color("blue"),
      fillColor: new Color("blue"),
      project: this.paperProject,
    });
    let rotor_axis = new Shape.Circle({
      center: motor_position,
      radius: 15,
      fillColor: new Color("black"),
      project: this.paperProject,
    });

    this.rotor = new Group({
      children: [rotor_positive, rotor_negative, rotor_axis],
      project: this.paperProject,
      applyMatrix: false,
    });
  }

  public startTimer() {
    this.interval = setInterval((e) => { this.onFrame(e); }, 20);
  }

  public onFrame(event) {

    // console.log("rotation: " + this.rotor.rotation);

    if (Math.floor(this.rotor.rotation) != (this.position % this.count_coils) * (180 / this.count_coils)) {
      this.rotor.rotate(this.direction);
      // this.rotor.rotate(this.position);
    }

  }

  public updateRotation(event) {
    this.setPosition(event.target.value);
  }

  public setPosition(p) {
    console.log("e: " + p);
    console.log("d: " + this.position);
    this.direction = p > this.position ? 1 : -1;
    this.position = p;
    console.log(this.direction);
  }

}
