vec3 objectNormal = vec3(normal);

float time = uTime * 0.001;
float angle = position.y + (sin(time));
mat2 rotateMatrix = getRotateMatrix_2D(angle);
objectNormal.xz = objectNormal.xz * rotateMatrix;

#ifdef USE_TANGENT

vec3 objectTangent = vec3(tangent.xyz);

#endif