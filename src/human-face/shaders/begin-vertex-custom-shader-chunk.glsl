vec3 transformed = vec3(position);

float time = uTime * 0.001;
float angle = position.y + (sin(time));
mat2 rotateMatrix = getRotateMatrix_2D(angle);

transformed.xz = transformed.xz * rotateMatrix;

#ifdef USE_ALPHAHASH

vPosition = vec3(position);
vPosition.y += 10.0;

#endif