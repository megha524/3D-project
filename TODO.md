# TODO List for Jewelry Box 3D Scene

## Step 1: Set up project structure
- Create index.html with basic A-Frame scene setup
- Create components.js for custom ECS components
- Create assets folder for any models or textures (if needed)

## Step 2: Implement basic scene
- Add jewelry box entity (cube geometry)
- Add 3 ring entities (torus geometries with distinct sizes/colors for distinction)
- Set up camera and basic lighting

## Step 3: Add visual fidelity
- Apply PBR metallic materials to rings
- Add HDRI environment map for reflections
- Ensure dynamic lighting and specular highlights

## Step 4: Implement focus interaction
- Add click event to rings to animate upward/forward and scale up
- Show close button UI when focused
- Prevent other interactions during animation

## Step 5: Implement return interaction
- Add click event to close button to animate back to original position/size
- Hide UI after return

## Step 6: Add drag-to-rotate component
- Create custom A-Frame component for Y-axis rotation via drag
- Ensure continuous rotation, proportional speed, Y-axis only

## Step 7: State management
- Implement logic to disable ring clicks during focus/animation
- Ensure smooth transitions and no conflicts

## Step 8: Testing and refinement
- Test interactions in browser
- Verify visual fidelity and responsiveness
- Make any necessary adjustments
