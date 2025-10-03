import { Request, Response } from "express";
import { OnvifDevice } from "node-onvif-ts";

// camera = ONVIFCamera('192.168.90.180', 80, 'admin', 'Artorius_2017')

export const getPtzController = (req: Request, res: Response) => {
  // Create an OnvifDevice object
  let device = new OnvifDevice({
    xaddr: "http://192.168.90.180:80",
    user: "admin",
    pass: "Artorius_2017",
  });

  // Initialize the OnvifDevice object
  device
    .init()
    .then(() => {
      // Move the camera
      return device.ptzMove({
        speed: {
          x: 1.0, // Speed of pan (in the range of -1.0 to 1.0)
          y: 0.0, // Speed of tilt (in the range of -1.0 to 1.0)
          z: 0.0, // Speed of zoom (in the range of -1.0 to 1.0)
        },
        timeout: 1, // seconds
      });
    })
    .then(() => {
      console.log("Done!");
    })
    .catch((error: any) => {
      console.error(error);
    });
};
