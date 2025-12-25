from ultralytics import YOLO
import glob
import os

def main():
    # 1. Load the best model weights
    model_path = "runs/segment/train4/weights/best.pt"
    model = YOLO(model_path)

    # 2. Specify validation images directory
    val_images_path = "./valid/images"

    print(f"Loading model from: {model_path}")
    print(f"Predicting images in: {val_images_path}")

    # 3. Predict
    # save=True : Save resulting images
    # conf=0.5  : Confidence threshold
    # project="runs/predict" : Output directory
    results = model.predict(
        source=val_images_path,
        save=True,
        imgsz=1024,
        conf=0.3,
        project="runs/predict",
        name="val_result_stats",
        verbose=False # Disable verbose logging
    )

    print("\n" + "="*50)
    print("Summary of Class Counts and Percentages per Image")
    print("="*50)

    # 4. Iterate through results
    for r in results:
        img_name = os.path.basename(r.path)
        print(f"\n Image: {img_name}")
        
        # Count objects per class
        class_counts = {}
        total_objects = len(r.boxes)

        if total_objects == 0:
            print("    No objects detected")
            continue

        # Get all class names
        names = r.names 
        
        # Iterate and count
        for c in r.boxes.cls:
            class_name = names[int(c)]
            class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        # Calculate % and display
        print(f" Total Objects: {total_objects}")
        for cls_name, count in class_counts.items():
            percent = (count / total_objects) * 100
            print(f" - {cls_name:<10}: {count:>3} ({percent:.2f}%)")

    print("\n" + "="*50)
    print("Done! Check results at: runs/predict/val_result_stats")

if __name__ == "__main__":
    main()
