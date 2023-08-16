#### Stage 1: Build the application
FROM adoptopenjdk/openjdk11:ubi as build

# Set the current working directory inside the image
WORKDIR /app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn

# Copy the pom.xml file
COPY pom.xml .

# Build all the dependencies in preparation to go offline. 
# This is a separate step so the dependencies will be cached unless 
# the pom.xml file has changed.
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency ; jar -xvf ../AssignmentProjectSubmission-0.0.1-SNAPSHOT.war)
#RUN cd ../ 
#RUN mkdir -p classes && (cd classes ; jar -x ../../AssignmentProjectSubmission-0.0.1-SNAPSHOT/WEB-INF/classes/*)


#### Stage 2: A minimal docker image with command to run the app 
FROM adoptopenjdk/openjdk11:ubi

ARG DEPENDENCY=/app/target/dependency

#COPY AssignmentProjectSubmission/target/AssignmentProjectSubmission-0.0.1-SNAPSHOT ${DEPENDENCY}

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/WEB-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/WEB-INF/classes /app

EXPOSE 8080 

ENTRYPOINT ["java","-cp","app:app/lib/*","com.spring.AssignmentProjectSubmission.AssignmentProjectSubmissionApplication"]